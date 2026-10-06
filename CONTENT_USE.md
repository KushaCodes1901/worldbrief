# WorldBrief content-use note

Provider documentation reviewed on 6 October 2026:

- [Pricing](https://currentsapi.services/en/product/price): the Developer plan lists 250 requests/day, headlines, and up to 20 results/request.
- [Quick start](https://currentsapi.services/en/docs/) and [latest-news reference](https://currentsapi.services/en/docs/latest_news): v2 is the canonical taxonomy path. WorldBrief requests `/v2/latest-news`, `language=en`, `page_size=20`, and the documented category for the active topic. Authentication uses the Authorization header with the Bearer scheme.
- [FAQ](https://currentsapi.services/en/faq): self-service use includes previews, attribution and link-out; short-lived operational caching is generally expected. API access does not grant publisher redistribution rights.
- [Terms](https://currentsapi.services/terms), especially Data license and Service Attribution: publisher rights remain with the original owners; preserve attribution and notices; do not create permanent copies or archives. Link “Powered by Currents News API” beside the display.

## Implemented approach

Display original headlines, clearly labelled source domains, valid publication dates in UTC, available authors, and direct external publisher links. Do not guess publisher names. Omit descriptions because permission for public display across publishers is unresolved. Also omit publisher images, full articles and AI summaries. Fetch through the official API, never scrape or bypass paywalls. React escapes external text instead of inserting provider HTML.

The magazine interface uses six original conceptual topic illustrations generated with the built-in image-generation tool on 6 October 2026. The optimised assets are local WebP files in `public/images/topics`; prompts are recorded in `docs/topic-art-prompts.json`. They are topic artwork, not photographs of news events. Topic tiles carry their own subject labels; any illustration beside a specific headline has a visible “Topic illustration” caption. About explains their origin. No publisher image URL is requested or displayed, and the illustrations do not add provider calls.

Only normalized headline metadata is operationally cached for one hour. Error cooldowns contain no article content and can last longer when Retry-After requests it. No news archive, database or real API response fixtures are committed. Local development caches are generated and ignored; remove `.next` when stopping local live integration if you need to clear that cache. Fixtures are original fictional examples labelled “Sample content” and link to example.com.

## Unresolved permissions

The API’s preview/link-out guidance supports the intended small demo, but it is not a blanket publisher licence. Whether a particular headline display is permitted can depend on publisher terms and applicable law. Confirm any requested publisher-specific notices and public preview use with Currents before a broader launch; omit affected sources if permission is unavailable. This project does not claim universal legal compliance. API keys can be removed to disable live news while retaining the portfolio interface.

The source-code licence covers original code and fictional examples only. It grants no rights to third-party news, publisher trademarks, or API content. Changes to provider terms require another review.
