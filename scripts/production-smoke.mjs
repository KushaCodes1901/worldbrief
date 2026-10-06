import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

// Deliberately fictional canary: verifies server env values stay out of public
// HTML and browser JavaScript. Demo mode means zero authenticated provider calls.
const canary = "worldbrief-fictional-secret-canary-2026";
const origin = "http://localhost:3020";
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", "3020"],
  {
    env: {
      ...process.env,
      CURRENTS_API_KEY: canary,
      WORLDBRIEF_DEMO_MODE: "true",
    },
    stdio: "ignore",
  },
);
let exited = false;
server.on("exit", () => {
  exited = true;
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 40 && !exited; attempt++) {
    try {
      ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok;
    } catch {
      /* starting */
    }
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, "Production smoke server could not start on port 3020");
  const assets = new Set();
  for (const path of [
    "/",
    "/topics/general",
    "/topics/technology",
    "/topics/business",
    "/topics/politics",
    "/topics/sports",
    "/topics/culture",
    "/about",
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(
      !html.includes(canary),
      "Private environment canary leaked into HTML",
    );
    if (path !== "/about") assert.ok(html.includes("Development demo"));
    for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g))
      assets.add(match[1]);
  }
  for (const path of assets) {
    const response = await fetch(new URL(path, origin));
    assert.ok(response.ok);
    assert.ok(
      !(await response.text()).includes(canary),
      "Private environment canary leaked into browser JavaScript",
    );
  }
  for (const topic of [
    "general",
    "technology",
    "business",
    "politics",
    "sports",
    "culture",
  ]) {
    const response = await fetch(origin + `/images/topics/${topic}.webp`);
    assert.equal(response.status, 200, `Missing topic artwork: ${topic}`);
    assert.ok(response.headers.get("content-type")?.includes("image/webp"));
    assert.ok((await response.arrayBuffer()).byteLength > 1000);
  }
  const optimized = await fetch(
    origin + "/_next/image?url=%2Fimages%2Ftopics%2Fgeneral.webp&w=640&q=75",
  );
  assert.equal(optimized.status, 200, "Production image optimization failed");
  assert.ok(optimized.headers.get("content-type")?.startsWith("image/"));
  const preview = await (await fetch(origin + "/preview/empty")).text();
  assert.ok(preview.includes("This story ends here."));
  assert.ok(!preview.includes("No headlines here just yet."));
  console.log(
    `Production smoke passed: eight pages, ${assets.size} JavaScript assets, six topic illustrations, image optimization, private env canary, and disabled QA previews. No live API was called.`,
  );
} finally {
  server.kill();
}
