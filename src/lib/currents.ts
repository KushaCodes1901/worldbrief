// Pure provider adapter. Only news.ts imports this in the app, behind server-only.
import { getTopic, isFeed, type Feed } from "./topics";

export type Article = {
  id: string;
  title: string;
  url: string;
  sourceDomain: string;
  author: string | null;
  publishedAt: string | null;
  category: string;
};
export type FeedResult =
  | { status: "ok"; articles: Article[]; fetchedAt: string; sample: boolean }
  | {
      status: "unavailable";
      reason:
        | "configuration"
        | "credentials"
        | "quota"
        | "timeout"
        | "provider"
        | "malformed"
        | "cache";
      retryAt: string | null;
    };

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed &&
    trimmed.toLowerCase() !== "none" &&
    trimmed.toLowerCase() !== "null"
    ? trimmed
    : null;
}
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || /[\u0000-\u0020]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    )
      return null;
    if (
      url.hostname === "localhost" ||
      url.hostname.endsWith(".local") ||
      url.hostname === "[::1]" ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(url.hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(url.hostname)
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
export function normalizeResponse(payload: unknown): Article[] {
  if (
    !payload ||
    typeof payload !== "object" ||
    !("status" in payload) ||
    payload.status !== "ok" ||
    !("news" in payload) ||
    !Array.isArray(payload.news)
  )
    throw new Error("Invalid provider response");
  const seenUrls = new Set<string>();
  const seenIds = new Set<string>();
  const articles: Article[] = [];
  for (const item of payload.news.slice(0, 20)) {
    if (!item || typeof item !== "object") continue;
    const title = text(item.title);
    const url = safeUrl(item.url);
    if (!title || !url || (item.language && item.language !== "en")) continue;
    const identity = new URL(url);
    identity.hash = "";
    const id = text(item.id) ?? identity.href;
    if (seenUrls.has(identity.href) || seenIds.has(id)) continue;
    seenUrls.add(identity.href);
    seenIds.add(id);
    const rawDate = text(item.published);
    const date = rawDate ? new Date(rawDate) : null;
    articles.push({
      id,
      title,
      url,
      sourceDomain: new URL(url).hostname.replace(/^www\./, ""),
      author: text(item.author),
      publishedAt:
        date && Number.isFinite(date.getTime()) ? date.toISOString() : null,
      category: Array.isArray(item.category)
        ? (text(item.category[0]) ?? "general")
        : "general",
    });
  }
  return articles;
}
export function retryTime(value: string | null, now: number): string | null {
  if (!value) return null;
  const seconds = /^\d+$/.test(value.trim()) ? Number(value.trim()) : null;
  const time = seconds !== null ? now + seconds * 1000 : Date.parse(value);
  return Number.isFinite(time) && time > now && time < 8.64e15
    ? new Date(time).toISOString()
    : null;
}
export async function fetchCurrents(
  feed: Feed,
  key: string,
  request: typeof fetch = fetch,
  now = Date.now(),
): Promise<FeedResult> {
  if (!isFeed(feed))
    return { status: "unavailable", reason: "configuration", retryAt: null };
  if (!key.trim())
    return { status: "unavailable", reason: "configuration", retryAt: null };
  const url = new URL("https://api.currentsapi.services/v2/latest-news");
  url.searchParams.set("language", "en");
  url.searchParams.set("page_size", "20");
  const topic = getTopic(feed);
  if (topic) url.searchParams.set("category", topic.category);
  try {
    const response = await request(url, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) {
      return {
        status: "unavailable",
        reason:
          response.status === 401 || response.status === 403
            ? "credentials"
            : response.status === 429
              ? "quota"
              : "provider",
        retryAt: retryTime(response.headers.get("retry-after"), now),
      };
    }
    try {
      const articles = normalizeResponse(await response.json());
      return {
        status: "ok",
        articles,
        fetchedAt: new Date(now).toISOString(),
        sample: false,
      };
    } catch {
      return { status: "unavailable", reason: "malformed", retryAt: null };
    }
  } catch (error) {
    const timeout =
      error instanceof Error &&
      ["TimeoutError", "AbortError"].includes(error.name);
    return {
      status: "unavailable",
      reason: timeout ? "timeout" : "provider",
      retryAt: null,
    };
  }
}
