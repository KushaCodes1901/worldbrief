// Local QA only: cannot enable preview states in a production deployment.
import { notFound } from "next/navigation";
import { NewsFeed } from "@/components/feed";
import Loading from "@/app/loading";
import { sampleFeed } from "@/lib/fixtures";
export const dynamic = "force-dynamic";
export default async function Preview({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.WORLDBRIEF_DEMO_MODE !== "true"
  )
    notFound();
  const { state } = await params;
  if (state === "loading") return <Loading />;
  if (state === "one" || state === "long") {
    const sample = sampleFeed("latest");
    if (sample.status !== "ok") notFound();
    const articles = sample.articles
      .slice(0, state === "one" ? 1 : 12)
      .map((article, index) => ({
        ...article,
        title:
          state === "long" && index % 3 === 0
            ? "Fictional community research project brings residents, independent makers and local libraries together to explore a more connected and thoughtful future for everyday public spaces"
            : article.title,
        author: index === 0 ? null : article.author,
        publishedAt: index === 0 ? null : article.publishedAt,
      }));
    return <NewsFeed active="latest" result={{ ...sample, articles }} />;
  }
  if (state === "empty")
    return (
      <NewsFeed
        active="latest"
        result={{
          status: "ok",
          articles: [],
          fetchedAt: "2026-10-06T12:00:00Z",
          sample: true,
        }}
      />
    );
  if (state === "unavailable")
    return (
      <NewsFeed
        active="latest"
        result={{ status: "unavailable", reason: "provider", retryAt: null }}
      />
    );
  notFound();
}
