import { type FeedResult } from "./currents";
import { isFeed, type Feed } from "./topics";

export const REFRESH_SECONDS = 3600;
export interface SharedCache {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options: { ttl: number; name: string }): Promise<unknown>;
}
// One fixed key per feed. No key, arbitrary query, or full provider response enters the cache.
export async function readCachedFeed(feed: Feed, cache: SharedCache, load: () => Promise<FeedResult>, now = Date.now()): Promise<FeedResult> {
  if (!isFeed(feed)) return { status: "unavailable", reason: "configuration", retryAt: null };
  const key = `worldbrief:currents-v2:headlines-only:v1:${feed}`;
  try {
    const hit = await cache.get(key) as { result?: FeedResult; expiresAt?: number } | null;
    if (hit?.result && typeof hit.expiresAt === "number" && hit.expiresAt > now) return hit.result;
    const result = await load();
    const retryAt = result.status === "unavailable" && result.retryAt ? Date.parse(result.retryAt) : now;
    const ttl = Math.max(REFRESH_SECONDS, Math.ceil((retryAt - now) / 1000));
    await cache.set(key, { result, expiresAt: now + ttl * 1000 }, { ttl, name: `WorldBrief ${feed}` });
    return result;
  } catch {
    // If shared caching fails, do not keep making uncached provider requests.
    return { status: "unavailable", reason: "cache", retryAt: null };
  }
}
