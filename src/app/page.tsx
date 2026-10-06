import { NewsFeed } from "@/components/feed";
import { getNews } from "@/lib/news";
export const dynamic = "force-dynamic";
export default async function Home() { return <NewsFeed active="latest" result={await getNews("latest")} />; }
