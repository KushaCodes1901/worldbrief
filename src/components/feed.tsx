import Link from "next/link";
import { topics, type Feed } from "@/lib/topics";
import type { Article, FeedResult } from "@/lib/currents";
import { Attribution } from "./chrome";
import { Arrow, Globe } from "./graphics";

function categoryLabel(category: string) {
  return (
    topics.find(
      (topic) => topic.slug === category || topic.category === category,
    )?.label ?? category.replaceAll("_", " ")
  );
}
function dateLabel(iso: string | null) {
  return iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(iso))
    : "Date unavailable";
}
export function TopicNav({ active }: { active: Feed }) {
  return (
    <nav aria-label="News topics" className="topic-nav">
      <Link
        href="/"
        prefetch={false}
        aria-current={active === "latest" ? "page" : undefined}
      >
        All headlines
      </Link>
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          prefetch={false}
          aria-current={active === topic.slug ? "page" : undefined}
        >
          {topic.label}
        </Link>
      ))}
    </nav>
  );
}
function ArticleCard({
  article,
  index,
  featured,
  sample,
}: {
  article: Article;
  index: number;
  featured?: boolean;
  sample: boolean;
}) {
  return (
    <article className={`article-card ${featured ? "featured-card" : ""}`}>
      <div className="article-top">
        <span className="eyebrow">{categoryLabel(article.category)}</span>
        <span className="article-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {featured && (
        <div className="feature-art">
          <Globe large />
          <span>
            THE WORLD,
            <br />
            IN PERSPECTIVE.
          </span>
        </div>
      )}
      <h2>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
          <Arrow />
          <span className="sr-only">
            {" "}
            ({sample ? "fictional example link" : "original article"}, opens an
            external website)
          </span>
        </a>
      </h2>
      <div className="article-details">
        <span className="source-domain">
          Source domain · {article.sourceDomain}
        </span>
        <span>
          {article.publishedAt ? (
            <time dateTime={article.publishedAt}>
              {dateLabel(article.publishedAt)} UTC
            </time>
          ) : (
            "Date unavailable"
          )}
        </span>
        {article.author && <span className="author">By {article.author}</span>}
      </div>
      <div className="read-label">
        {sample ? "Fictional example" : "Read at source"} <Arrow />
      </div>
    </article>
  );
}
export function FeedStatus({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="feed-status" role="status">
      <span className="eyebrow">A moment of quiet</span>
      <h2>{title}</h2>
      <p>{children}</p>
      <Link href="/" prefetch={false} className="text-link">
        Back to all headlines <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
export function NewsFeed({
  active,
  result,
}: {
  active: Feed;
  result: FeedResult;
}) {
  const topic = topics.find((item) => item.slug === active);
  const isSample = result.status === "ok" && result.sample;
  return (
    <main id="main-content" className="shell main-shell">
      <section className="intro" aria-labelledby="page-title">
        <div>
          <span className="eyebrow">Your window to what’s happening</span>
          <h1 id="page-title">
            {topic ? (
              topic.label
            ) : (
              <>
                A world of stories.
                <br />
                <em>One place to begin.</em>
              </>
            )}
          </h1>
          <p>
            Discover the latest headlines. Follow the sources.
            <br className="desktop-break" /> Make room for a wider perspective.
          </p>
        </div>
        <div className="intro-art">
          <Globe />
          <span>Different sources. More perspective.</span>
        </div>
      </section>
      <TopicNav active={active} />
      <section aria-labelledby="latest-title" className="news-section">
        <div className="section-heading">
          <h2 id="latest-title">
            Latest headlines <span className="small-dot" />
          </h2>
          <Attribution />
        </div>
        {isSample && (
          <div className="sample-banner" role="note">
            <strong>Sample content</strong>
            <span>
              Development demo · These headlines are fictional. Example links
              open example.com.
            </span>
          </div>
        )}
        <div className="news-layout">
          <div>
            {result.status === "unavailable" ? (
              <FeedStatus title="Current news is unavailable.">
                We couldn’t load this feed. Please check back later.{" "}
                {result.reason === "configuration" &&
                  "The news connection hasn’t been configured yet."}
                {result.retryAt && (
                  <>
                    {" "}
                    The provider asks us to wait until{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }).format(new Date(result.retryAt))}{" "}
                    UTC before another request.
                  </>
                )}
              </FeedStatus>
            ) : result.articles.length === 0 ? (
              <FeedStatus title="No headlines here just yet.">
                The source returned no articles for this feed. Try another topic
                or visit later.
              </FeedStatus>
            ) : (
              <div className="article-grid">
                {result.articles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                    featured={index === 0}
                    sample={result.sample}
                  />
                ))}
              </div>
            )}
          </div>
          <aside className="sidebar">
            <div className="reader-note">
              <span className="eyebrow">A note to the reader</span>
              <h2>
                Start here.
                <br />
                <em>Read further.</em>
              </h2>
              <p>
                A headline is a doorway, not the whole story. Every link takes
                you to the original source, where the reporting lives.
              </p>
              <Link href="/about" prefetch={false} className="text-link">
                The idea behind WorldBrief <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="edition-note">
              <span className="eyebrow">The brief</span>
              <dl>
                <div>
                  <dt>Language</dt>
                  <dd>English</dd>
                </div>
                <div>
                  <dt>Topics</dt>
                  <dd>Six perspectives</dd>
                </div>
                <div>
                  <dt>Refresh</dt>
                  <dd>Hourly, on request</dd>
                </div>
                <div>
                  <dt>Purpose</dt>
                  <dd>Personal portfolio</dd>
                </div>
              </dl>
              {result.status === "ok" && (
                <p className="fetched-note">
                  {result.sample ? "Sample edition" : "Feed retrieved"}
                  <br />
                  <time dateTime={result.fetchedAt}>
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }).format(new Date(result.fetchedAt))}{" "}
                    UTC
                  </time>
                </p>
              )}
            </div>
            <div className="sidebar-signature">
              Stay curious.<span aria-hidden="true">↗</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
