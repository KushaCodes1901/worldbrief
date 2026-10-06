"use client";
import Link from "next/link";
export default function ErrorPage() {
  return (
    <main id="main-content" className="shell state-page">
      <span className="eyebrow">WorldBrief</span>
      <h1>A pause in the brief.</h1>
      <p>This page couldn’t be loaded. Please return later.</p>
      <Link href="/" prefetch={false} className="text-link">
        Back to the homepage →
      </Link>
    </main>
  );
}
