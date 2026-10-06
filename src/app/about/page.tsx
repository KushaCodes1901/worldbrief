import Link from "next/link";
import type { Metadata } from "next";
import { Globe } from "@/components/graphics";
export const metadata: Metadata = { title: "About the project" };
export default function About() {
  return (
    <main id="main-content" className="shell about-page">
      <span className="eyebrow">Behind the brief</span>
      <h1>
        A small project.
        <br />
        <em>A wider perspective.</em>
      </h1>
      <div className="about-layout">
        <div className="about-copy">
          <p className="lead">
            I’m Shkamb, a beginner developer from Kosovo. I built WorldBrief to
            practise turning an idea into a working website with AI assistance.
          </p>
          <h2>What WorldBrief does</h2>
          <p>
            WorldBrief brings recent English headlines into one quiet, readable
            space. The homepage and six topic feeds use the official{" "}
            <a
              href="https://currentsapi.services/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Currents News API ↗
            </a>
            . Each real headline links directly to the original article. This is
            a personal, non-commercial portfolio project.
          </p>
          <h2>Sources deserve the spotlight</h2>
          <p>
            Original headlines, source domains, publication dates and available
            author credits are preserved. Source domains are labelled as
            domains, rather than guessed publisher names. Descriptions,
            photographs and full articles are omitted. WorldBrief does not
            scrape publishers, bypass paywalls, or create AI summaries.
          </p>
          <h2>A little context matters</h2>
          <p>
            Coverage depends on the provider’s selection and metadata. Headlines
            may be delayed, incomplete, duplicated or inaccurate. I don’t
            independently verify the reporting. Read the original articles and
            compare sources before drawing conclusions. Dates are shown in UTC.
          </p>
          <h2>Content use & limitations</h2>
          <p>
            API access is not a blanket licence to republish publisher content.
            Currents describes self-service use as previews, attribution and
            link-out, while publisher rights remain with the original owners.
            This version limits display to headline metadata and keeps only
            short-lived operational caches. Permission for any broader display
            needs to be checked before expansion. This is an implementation
            note, not a claim of universal legal compliance.
          </p>
          <p>
            Feeds refresh on request after a 60-minute cache period, rather than
            continuously. Quotas, service outages and cache misses can affect
            availability. A visible “Sample content” banner identifies explicit
            demo mode; those headlines are fictional and link to example.com.
          </p>
          <h2>How AI helped</h2>
          <p>
            I used AI assistance to research documentation, design and implement
            the interface, write focused tests, and prepare publishing
            instructions. The project helps me learn how server components,
            private API keys, caching and responsive design fit together.
          </p>
          <Link href="/" prefetch={false} className="text-link">
            Explore the headlines →
          </Link>
        </div>
        <aside className="about-aside">
          <Globe large />
          <span className="eyebrow">Built to learn</span>
          <p>
            Next.js
            <br />
            TypeScript
            <br />
            Tailwind CSS
          </p>
          <span className="about-signature">Shkamb</span>
        </aside>
      </div>
    </main>
  );
}
