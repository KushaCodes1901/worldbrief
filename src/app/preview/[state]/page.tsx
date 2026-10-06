// Local QA only: cannot enable preview states in a production deployment.
import { notFound } from "next/navigation";
import { NewsFeed } from "@/components/feed";
import Loading from "@/app/loading";
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
