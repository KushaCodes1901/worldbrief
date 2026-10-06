# WorldBrief magazine redesign

Implemented locally on 6 October 2026. At the end of the initial redesign, nothing had been pushed to GitHub or published to Vercel. Subsequent launch status is recorded in README.

## Design

Dark masthead, confident editorial typography, cobalt/coral/yellow/teal accents, an opening news composition, six image-led topic links, varied article cards and a clear reading invitation. On phones the opening headline comes before its illustration so the complete sample headline is visible at 375 × 812. The complete opening sample headline is also visible at 1440 × 900.

All original article URLs, category order, source domains, UTC dates, available authors, sample labels and provider attribution are retained. Provider fetching, credentials, normalization and caching modules were not changed. All internal links retain disabled prefetching.

## Original artwork

Six topic illustrations were generated with the built-in image_gen tool, then optimised into local 1200 × 800 WebP assets. No API-key CLI fallback was used. The complete prompt set and provenance are recorded in [topic-art-prompts.json](topic-art-prompts.json).

- [General](../public/images/topics/general.webp)
- [Technology & Science](../public/images/topics/technology.webp)
- [Business](../public/images/topics/business.webp)
- [Politics](../public/images/topics/politics.webp)
- [Sports](../public/images/topics/sports.webp)
- [Culture](../public/images/topics/culture.webp)

These are conceptual illustrations, not photographs of reported events. Art beside a headline is visibly captioned “Topic illustration”; About explains its origin. Decorative images have empty alt text, while topic link text supplies the accessible destination name. Image dimensions are reserved, responsive sizes are provided and only the opening illustration is loaded eagerly.

## Verification

- Lint, TypeScript and all 11 existing tests pass.
- Production build passes. HTTP smoke verifies eight pages, nine browser JavaScript assets, all six WebP assets and the production image optimiser. The fictional private environment canary is absent from HTML/JavaScript, and development QA pages are disabled in production.
- Secret pattern scan passes; this is not proof of the absence of every possible secret.
- Homepage screenshots inspected at 375, 768, 840 and 1440 pixels with no horizontal page overflow. Long-title layouts at those widths have no overlapping cards or horizontally clipped headlines.
- Single-item, missing-author/date, empty, unavailable, loading and not-found views inspected. About also checked at 375 pixels.
- Keyboard topic switching, horizontal topic scrolling, skip link and visible focus checked. External article links retain target="_blank" with noopener/noreferrer.
- All nine homepage image instances load; only the opening image is eager. Focus applies the intended modest image zoom with a 200ms transition.
- Core small-text colour pairs exceed 4.5:1 contrast (checked ratios 5.44–6.02). Reduced-motion CSS removes transitions and image transforms; the browser's reduced-motion preference was not toggled during testing.

## Screenshots and limits

[Desktop](screenshots/desktop.jpg), [full page](screenshots/desktop-full.jpg), [phone](screenshots/mobile.jpg), [tablet](screenshots/tablet.jpg), [840px layout](screenshots/intermediate.jpg).

Preview: http://localhost:3000/. Screenshots and browser checks use explicitly labelled fictional sample headlines. No live provider call, real key, deployed cache or Vercel deployment was verified or initiated. Real headlines can differ in length and metadata; the long-title and missing-field QA examples check those layout conditions without pretending to verify live reporting.
