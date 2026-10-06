# WorldBrief

A personal, non-commercial English news discovery portfolio project by **Shkamb**. Browse recent headlines across six topics, then follow direct links to the original publishers. Built with AI assistance as a first working development portfolio project.

**Repository:** [KushaCodes1901/worldbrief](https://github.com/KushaCodes1901/worldbrief)

**Publishing status:** public repository created; Vercel deployment awaits account setup. Real Currents news and deployed cache reuse have not yet been tested with a live key. No live website URL has been verified yet.

## Interface

These screenshots show **clearly labelled fictional sample content**, not live reporting.

![WorldBrief desktop interface](docs/screenshots/desktop.jpg)

<details>
<summary>Mobile and tablet</summary>

![WorldBrief mobile interface](docs/screenshots/mobile.jpg)
![WorldBrief tablet interface](docs/screenshots/tablet.jpg)

</details>

## What it does

- Homepage plus General, Technology & Science, Business, Politics, Sports and Culture feeds.
- Original headline links, source domains, publication dates in UTC, and available author credits.
- Responsive cream-and-ink editorial design with original SVG graphics, keyboard navigation, skip link and visible focus.
- About, loading, empty, unavailable-service and not-found screens.
- Server-only Currents integration, safe response normalization and one-hour operational caching.
- No accounts, database, full-article pages, publisher photos, descriptions, AI summaries, polling, or news archive.

## Technology choices

Next.js **16.4.0** App Router, React **19.3.0**, TypeScript **6.0.3**, Tailwind CSS **4.3.3**, Node.js **24**, ESLint **10.12.0**, and `@vercel/functions` for shared production caching. Versions are pinned in package.json and package-lock.json. TypeScript 6 is the newest compatible stable version supported by the installed TypeScript ESLint parser; TypeScript 7 is outside its supported range. System fonts avoid external font requests and build downloads. Native Node tests via tsx keep the test setup small.

## Run locally

Install Node.js 24 LTS, open this folder in your terminal, then run:

```sh
npm ci
npm run demo
```

Visit http://localhost:3000. The `demo` script explicitly enables fictional fixtures and the visible **Sample content** banner. It requires no key and calls no news provider. Fixture article links go to example.com. Use Ctrl+C to stop the server.

For real news, copy `.env.example` to `.env.local` (PowerShell: `Copy-Item .env.example .env.local`). Create a [free Currents account](https://currentsapi.services/en/docs/), get your key from its dashboard, and edit `.env.local` locally:

```dotenv
CURRENTS_API_KEY=
WORLDBRIEF_DEMO_MODE=false
WORLDBRIEF_GITHUB_URL=
```

Put your key after `CURRENTS_API_KEY=` **in that private file only**. Never paste it into chat, a screenshot, README, git commit, or a NEXT_PUBLIC variable. Restart with `npm run dev`. A missing key shows unavailable service; production failures never silently switch to fixtures. `.env*` is ignored except the blank `.env.example`.

```sh
npm run check
npm run build
npm run scan:secrets
npm start
```

Builds and routine checks require no news key and do not call Currents. Development-only QA screens at `/preview/loading`, `/preview/empty`, and `/preview/unavailable` are available only during `npm run demo`; they return not-found in production.

## Structure, in plain language

`src/app` defines the homepage, topic pages and About page. `src/components` creates the shared page layout and article cards. `src/lib/currents.ts` is the small replaceable provider adapter: it requests and validates news, retaining only safe headline metadata. `src/lib/news.ts` keeps the key on the server and connects to the cache. `src/lib/feed-cache.ts` handles reuse and failure cooldowns; `fixtures.ts` contains original fictional examples. Tests exercise those boundaries.

## Requests, caching and free limits

Provider documentation checked **6 October 2026**: the [free plan](https://currentsapi.services/en/product/price) lists **250 requests/day** and **up to 20 results/request**. This project uses the [documented v2 latest-news endpoint](https://currentsapi.services/en/docs/latest_news) with `language=en`, `page_size=20`, header authentication and canonical category identifiers.

There are seven fixed cache keys: homepage plus six allowlisted topics. Arbitrary query parameters are ignored and cannot create provider requests or cache keys. Only the visited feed is fetched; internal Next links use `prefetch={false}`. There is no polling, pagination, bulk fetching, automatic retry loop or refresh endpoint.

On **Vercel production**, `getCache()` uses its shared [Runtime Cache](https://vercel.com/docs/caching/runtime-cache), with a **3600-second expiry**, not process-local storage. Only normalized results are cached. Vercel runs the project in one configured region (`fra1`), avoiding separate regional feed caches. Cache entries expire rather than intentionally retaining stale article archives. Failure results are cached for at least an hour, or longer when Retry-After requires it. If the shared cache cannot be read, the provider is not called. If a cache write fails after a provider call, the page shows unavailable service. Local development uses an ignored disk cache with the same expiry/cooldown logic; this does not establish deployed shared-cache behavior.

**7 feeds × 24 hourly refreshes ≈ 168 requests/day** if every feed is visited after every expiry. This is a planning estimate, not a hard cap. Concurrent cold misses, cache eviction, deployments/cache purges, manual checks and local development can add requests. There is no distributed lock or guaranteed daily request budget. Vercel preview deployments do not fetch live news, and no requests happen during builds. Monitor actual Currents usage. Keep the key in Production only on Vercel; use explicit sample mode in Preview if desired. Runtime Cache shares storage across a Hobby team, so other projects can evict entries.

Vercel's [Hobby plan](https://vercel.com/docs/plans/hobby) is for personal, non-commercial use and has usage caps. Stay on Hobby; do not select paid add-ons or Pro trials. Review Vercel usage along with API usage. No service purchase is necessary for this demo.

## Attribution and content limitations

The linked **Powered by Currents News API** notice appears beside the feed and in the footer. Source domain labels, author credits and direct publisher links appear on cards. API access does not grant blanket publisher rights. Descriptions and photographs are deliberately omitted. See [CONTENT_USE.md](CONTENT_USE.md) for the implemented approach and unresolved permissions. The MIT licence covers original code and fictional examples only; third-party news content is excluded.

## Testing and evidence

- Lint, strict TypeScript checking, production build and dependency audit.
- Focused automated tests: normalization, missing fields, duplicates, invalid dates, non-English records, unsafe URLs, topic validation, authenticated request construction, credentials/quota/provider/timeout errors, sanitized failures, shared-cache contract reuse/expiry/isolation, long Retry-After and fail-closed cache errors.
- Browser checks at 375, 768 and 1440 pixels: no horizontal overflow; desktop, tablet and mobile screenshots; visible keyboard focus; keyboard topic switching; correct external link attributes; loading, empty, unavailable and invalid-topic screens.
- Pattern scan of publishable files and browser-delivered build assets. Scans reduce risk but are not a mathematical guarantee.

**Not yet verified:** a real key, actual publisher links from live responses, actual free account category access, production cache hits and public Vercel access. Mocked tests are not live integration tests. See [PUBLISHING.md](PUBLISHING.md) for the remaining verification steps. GitHub Actions runs checks and the production build without secrets.

## AI assistance

AI helped research the official documentation, design the editorial interface, implement the server adapter and cache, write focused tests, and prepare publishing instructions. Shkamb can use the small module boundaries to explain and extend the app. Provider reporting is not generated or independently verified by AI.

## Roadmap

1. **Browser-local bookmarks** — the strongest next feature: save links on the current device without accounts, servers or extra news requests. Store links rather than full publisher content.
2. API keyword search — requires separate search endpoint, bounded cache entries and a revised quota budget.
3. Country filters — use documented region identifiers and revisit the fixed-feed budget.
4. Dark mode — preserve contrast and respect the user's appearance preference.
