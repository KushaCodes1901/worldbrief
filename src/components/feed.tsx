import Image from "next/image";
import Link from "next/link";
import { topics, type Feed, type Topic } from "@/lib/topics";
import { articleTopic, topicArt } from "@/lib/topic-art";
import type { Article, FeedResult } from "@/lib/currents";
import { Attribution } from "./chrome";
import { Arrow } from "./graphics";

function dateLabel(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
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
          data-topic={topic.slug}
          aria-current={active === topic.slug ? "page" : undefined}
        >
          {topic.label}
        </Link>
      ))}
    </nav>
  );
}

export function TopicImage({
  topic,
  eager = false,
  sizes = "(max-width: 600px) 100vw, 50vw",
}: {
  topic: Topic["slug"];
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={`/images/topics/${topic}.webp`}
      alt=""
      width={1200}
      height={800}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
    />
  );
}

function ArticleCard({
  article,
  index,
  variant = "standard",
  sample,
  illustrated = false,
}: {
  article: Article;
  index: number;
  variant?: "featured" | "compact" | "standard";
  sample: boolean;
  illustrated?: boolean;
}) {
  const topic = articleTopic(article.category);
  const artTopic = topic?.slug ?? "general";
  const showArt = variant === "featured" || illustrated;
  return (
    <article className={`article-card ${variant}-card`} data-topic={artTopic}>
      {showArt && (
        <figure className="article-art">
          <TopicImage
            topic={artTopic}
            eager={variant === "featured"}
            sizes={
              variant === "featured"
                ? "(max-width: 680px) 100vw, (max-width: 1100px) 55vw, 700px"
                : "(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
            }
          />
          <figcaption>Topic illustration</figcaption>
        </figure>
      )}
      <div className="article-body">
        <div className="article-top">
          <span className="category-label">
            <span aria-hidden="true" />
            {topic?.label ?? article.category.replaceAll("_", " ")}
          </span>
          <span className="article-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
            <Arrow />
            <span className="sr-only">
              {" "}
              ({sample ? "fictional example link" : "original article"}, opens
              an external website)
            </span>
          </a>
        </h3>
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
          {article.author && (
            <span className="author">By {article.author}</span>
          )}
        </div>
        <span className="read-label">
          {sample ? "Fictional example" : "Read at source"} <Arrow />
        </span>
      </div>
    </article>
  );
}

function ExploreTopics({ active }: { active: Feed }) {
  return (
    <section className="explore-section" aria-labelledby="explore-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Follow your curiosity</span>
          <h2 id="explore-title">
            Explore your interests<span className="colour-period">.</span>
          </h2>
        </div>
        <p>Six ways into a wider world.</p>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => (
          <Link
            className="topic-tile"
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            prefetch={false}
            data-topic={topic.slug}
            aria-current={active === topic.slug ? "page" : undefined}
          >
            <div className="topic-tile-art">
              <TopicImage
                topic={topic.slug}
                sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 17vw"
              />
            </div>
            <div className="topic-tile-copy">
              <span>{topic.label}</span>
              <Arrow />
            </div>
            <span className="topic-tile-note">{topicArt[topic.slug].note}</span>
          </Link>
        ))}
      </div>
    </section>
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
  const articles = result.status === "ok" ? result.articles : [];
  const opening = articles.slice(0, 4);
  const remaining = articles.slice(4);
  // Illustrate at most one more card per category, keeping the feed order intact.
  const usedArt = new Set([
    articleTopic(articles[0]?.category ?? "")?.slug ?? "general",
  ]);
  const illustrated = new Set<number>();
  remaining.forEach((article, index) => {
    const slug = articleTopic(article.category)?.slug;
    if (index % 4 === 0 && slug && !usedArt.has(slug)) {
      illustrated.add(index);
      usedArt.add(slug);
    }
  });
  return (
    <main id="main-content" className="shell main-shell">
      <TopicNav active={active} />
      <section
        className={`intro ${topic ? "topic-intro" : ""}`}
        data-topic={topic?.slug}
        aria-labelledby="page-title"
      >
        <div>
          <span className="eyebrow">
            {topic
              ? topicArt[topic.slug].name
              : "A little curiosity goes a long way"}
          </span>
          <h1 id="page-title">
            {topic ? (
              topic.label
            ) : (
              <>
                Your world. Your interests.
                <br />
                <em>Your next read.</em>
              </>
            )}
          </h1>
          <p>
            Discover a headline. Read the full story at its original source.
          </p>
        </div>
        <div className="intro-stamp" aria-hidden="true">
          <span className="stamp-star">✳</span>
          <span>
            Stay curious.
            <br />
            Go further.
          </span>
          <Arrow />
        </div>
      </section>
      <section aria-labelledby="latest-title" className="news-section">
        <div className="section-heading feed-heading">
          <h2 id="latest-title">
            <span className="small-dot" />
            Latest headlines
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
        ) : articles.length === 0 ? (
          <FeedStatus title="No headlines here just yet.">
            The source returned no articles for this feed. Try another topic or
            visit later.
          </FeedStatus>
        ) : (
          <div
            className={`opening-grid ${opening.length === 1 ? "single-story" : ""}`}
          >
            <ArticleCard
              article={opening[0]}
              index={0}
              variant="featured"
              sample={isSample}
            />
            {opening.length > 1 && (
              <div className="opening-stack">
                {opening.slice(1).map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index + 1}
                    variant="compact"
                    sample={isSample}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <ExploreTopics active={active} />
      {remaining.length > 0 && (
        <section className="more-section" aria-labelledby="more-title">
          <div className="section-heading">
            <h2 id="more-title">
              Keep exploring<span className="colour-period">.</span>
            </h2>
            <span className="eyebrow">More from this feed</span>
          </div>
          <div className="article-grid">
            {remaining.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index + 4}
                sample={isSample}
                illustrated={illustrated.has(index)}
              />
            ))}
          </div>
        </section>
      )}
      <aside className="reader-band">
        <span className="band-star" aria-hidden="true">
          ✳
        </span>
        <div>
          <h2>A headline is just the beginning.</h2>
          <p>
            Follow the source. Find the context. Make room for another
            perspective.
          </p>
        </div>
        <Link href="/about" prefetch={false} className="band-link">
          Meet WorldBrief <Arrow />
        </Link>
      </aside>
    </main>
  );
}
