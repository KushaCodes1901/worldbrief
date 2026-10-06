import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fetchCurrents,
  normalizeResponse,
  retryTime,
  safeUrl,
  type FeedResult,
} from "../src/lib/currents";
import { readCachedFeed, type SharedCache } from "../src/lib/feed-cache";
import { getTopic, isFeed, topics, type Feed } from "../src/lib/topics";
import { sampleFeed } from "../src/lib/fixtures";

const article = {
  id: "fictional-id",
  title: "Fictional test headline",
  url: "https://example.com/article",
  language: "en",
  published: "2026-10-06 12:00:00 +0000",
  author: null,
  description: "Not licensed for display",
  image: "https://example.com/image.jpg",
  category: ["science_technology"],
};
test("normalization retains original headline and safe metadata, drops descriptions and images", () => {
  const [result] = normalizeResponse({ status: "ok", news: [article] });
  assert.equal(result.title, article.title);
  assert.equal(result.sourceDomain, "example.com");
  assert.equal(result.author, null);
  assert.equal(result.publishedAt, "2026-10-06T12:00:00.000Z");
  assert.ok(!("description" in result));
  assert.ok(!("image" in result));
});
test("missing fields, invalid dates, duplicate ids/links, non-English and unsafe URLs", () => {
  const result = normalizeResponse({
    status: "ok",
    news: [
      article,
      { ...article, id: "duplicate-url", url: `${article.url}#anchor` },
      { ...article, url: "https://example.com/other" },
      { ...article, id: "bad", url: "javascript:alert(1)" },
      { ...article, id: "bad-title", title: " " },
      {
        ...article,
        id: "foreign",
        url: "https://example.com/foreign",
        language: "fr",
      },
      {
        title: "Fictional missing fields",
        url: "https://example.com/missing",
        author: "None",
        published: "not-a-date",
      },
      null,
    ],
  });
  assert.equal(result.length, 2);
  assert.equal(result[1].publishedAt, null);
  assert.equal(result[1].author, null);
});
test("malformed envelopes are errors while an empty valid feed is empty", () => {
  for (const value of [
    null,
    {},
    { status: "error", news: [] },
    { status: "ok", news: {} },
  ])
    assert.throws(() => normalizeResponse(value));
  assert.deepEqual(normalizeResponse({ status: "ok", news: [] }), []);
});
test("only HTTP(S) public links without credentials are accepted", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,x",
    "file:///C:/secret",
    "//example.com",
    "https://name:password@example.com",
    "https://localhost/",
    "https://127.0.0.1/",
    "https://192.168.1.1/",
    "https://[::1]/",
    "bad",
    "https://example.com/\n",
  ])
    assert.equal(safeUrl(value), null);
  assert.equal(safeUrl("https://example.com/news"), "https://example.com/news");
  assert.equal(safeUrl("http://example.com"), "http://example.com/");
});
test("seven fixed feeds and canonical category identifiers", () => {
  assert.equal(topics.length, 6);
  assert.equal(getTopic("technology")?.category, "science_technology");
  assert.equal(getTopic("sports")?.category, "sport");
  assert.ok(isFeed("latest"));
  for (const input of [
    "unknown",
    "__proto__",
    "Technology",
    "latest?category=x",
  ])
    assert.ok(!isFeed(input));
});
test("one provider call, header authentication and documented query parameters", async () => {
  let count = 0;
  const request: typeof fetch = async (input, init) => {
    count++;
    const url = new URL(String(input));
    assert.equal(
      url.origin + url.pathname,
      "https://api.currentsapi.services/v2/latest-news",
    );
    assert.equal(url.searchParams.get("language"), "en");
    assert.equal(url.searchParams.get("page_size"), "20");
    assert.equal(url.searchParams.get("category"), "science_technology");
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer fictional-test-token",
    );
    assert.ok(!url.href.includes("token"));
    assert.equal(init?.redirect, "error");
    return Response.json({ status: "ok", news: [article] });
  };
  assert.equal(
    (await fetchCurrents("technology", "fictional-test-token", request)).status,
    "ok",
  );
  assert.equal(count, 1);
});
test("provider failures are sanitized, no retries, Retry-After supports seconds and dates", async () => {
  for (const [status, reason] of [
    [401, "credentials"],
    [403, "credentials"],
    [429, "quota"],
    [503, "provider"],
  ] as const) {
    let count = 0;
    const result = await fetchCurrents(
      "latest",
      "fictional-test-token",
      async () => {
        count++;
        return new Response("secret upstream error", {
          status,
          headers: { "Retry-After": "7200" },
        });
      },
      0,
    );
    assert.deepEqual(result, {
      status: "unavailable",
      reason,
      retryAt: "1970-01-01T02:00:00.000Z",
    });
    assert.equal(count, 1);
    assert.ok(!JSON.stringify(result).includes("secret"));
  }
  assert.equal(
    retryTime("Thu, 01 Jan 1970 02:00:00 GMT", 0),
    "1970-01-01T02:00:00.000Z",
  );
  assert.equal(retryTime("bad", 0), null);
  const malformed = await fetchCurrents(
    "latest",
    "fictional-test-token",
    async () => Response.json({ status: "error" }),
  );
  assert.equal(
    malformed.status === "unavailable" && malformed.reason,
    "malformed",
  );
  const timeout = await fetchCurrents(
    "latest",
    "fictional-test-token",
    async () => {
      throw new DOMException("private diagnostic", "TimeoutError");
    },
  );
  assert.equal(timeout.status === "unavailable" && timeout.reason, "timeout");
  const network = await fetchCurrents(
    "latest",
    "fictional-test-token",
    async () => {
      throw new Error("private diagnostic");
    },
  );
  assert.equal(network.status === "unavailable" && network.reason, "provider");
});
function fakeCache() {
  const values = new Map<string, unknown>();
  const ttls: number[] = [];
  const cache: SharedCache = {
    get: async (key) => values.get(key) ?? null,
    set: async (key, value, options) => {
      values.set(key, value);
      ttls.push(options.ttl);
    },
  };
  return { cache, values, ttls };
}
test("cache reuse, expiry and per-feed isolation without arbitrary entries", async () => {
  const { cache, values, ttls } = fakeCache();
  let calls = 0;
  const load = async () => {
    calls++;
    return sampleFeed("latest");
  };
  await readCachedFeed("latest", cache, load, 0);
  await readCachedFeed("latest", cache, load, 1000);
  assert.equal(calls, 1);
  await readCachedFeed("general", cache, load, 1000);
  assert.equal(calls, 2);
  await readCachedFeed("latest", cache, load, 3600001);
  assert.equal(calls, 3);
  assert.equal(ttls[0], 3600);
  await readCachedFeed("unknown" as Feed, cache, load, 3600002);
  assert.equal(calls, 3);
  assert.equal(values.size, 2);
});
test("shared cached failures honour a long Retry-After", async () => {
  const { cache, ttls } = fakeCache();
  let calls = 0;
  const load = async (): Promise<FeedResult> => {
    calls++;
    return {
      status: "unavailable",
      reason: "quota",
      retryAt: "1970-01-01T02:00:00Z",
    };
  };
  await readCachedFeed("latest", cache, load, 0);
  await readCachedFeed("latest", cache, load, 3600001);
  assert.equal(calls, 1);
  assert.equal(ttls[0], 7200);
});
test("cache failure fails closed before calling provider", async () => {
  let calls = 0;
  const cache: SharedCache = {
    get: async () => {
      throw new Error("private cache error");
    },
    set: async () => {},
  };
  const result = await readCachedFeed("latest", cache, async () => {
    calls++;
    return sampleFeed("latest");
  });
  assert.equal(calls, 0);
  assert.equal(result.status === "unavailable" && result.reason, "cache");
});
test("fixtures are explicitly sample content and filtered by topic", () => {
  const result = sampleFeed("sports");
  assert.equal(result.status, "ok");
  if (result.status === "ok") {
    assert.equal(result.sample, true);
    assert.ok(
      result.articles.every(
        (item) =>
          item.category === "sports" && item.sourceDomain === "example.com",
      ),
    );
  }
});
