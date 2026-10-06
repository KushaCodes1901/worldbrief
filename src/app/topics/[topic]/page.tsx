import { notFound } from "next/navigation";
import { NewsFeed } from "@/components/feed";
import { getNews } from "@/lib/news";
import { getTopic } from "@/lib/topics";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = getTopic((await params).topic);
  return { title: topic?.label ?? "Topic not found" };
}
export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();
  return <NewsFeed active={topic.slug} result={await getNews(topic.slug)} />;
}
