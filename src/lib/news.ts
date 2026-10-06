import "server-only";
import { getCache } from "@vercel/functions";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { fetchCurrents, type FeedResult } from "./currents";
import { readCachedFeed, type SharedCache } from "./feed-cache";
import { sampleFeed } from "./fixtures";
import type { Feed } from "./topics";

// Local disk storage is for development only. Vercel always uses the shared cache.
const directory = join(process.cwd(), ".next", "cache", "worldbrief");
const localCache: SharedCache = {
  async get(key) {
    try { return JSON.parse(await readFile(join(directory, `${encodeURIComponent(key)}.json`), "utf8")); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
  },
  async set(key, value) {
    await mkdir(directory, { recursive: true });
    const path = join(directory, `${encodeURIComponent(key)}.json`);
    const temporary = `${path}.${crypto.randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
    await rename(temporary, path);
  },
};
export async function getNews(feed: Feed): Promise<FeedResult> {
  if (process.env.WORLDBRIEF_DEMO_MODE === "true") return sampleFeed(feed);
  const key = process.env.CURRENTS_API_KEY;
  if (!key) return { status: "unavailable", reason: "configuration", retryAt: null };
  if (process.env.VERCEL === "1") {
    // Preview never consumes the real free-tier quota.
    if (process.env.VERCEL_ENV !== "production") return { status: "unavailable", reason: "configuration", retryAt: null };
    return readCachedFeed(feed, getCache(), () => fetchCurrents(feed, key));
  }
  return readCachedFeed(feed, localCache, () => fetchCurrents(feed, key));
}
