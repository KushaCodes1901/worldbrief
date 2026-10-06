# WorldBrief redesign prompt for Codex

Final direction chosen by Shkamb: **a bold, colourful modern magazine, with original images and subtle effects**. Use your creative judgement for a broad international audience. The brief below is ready to copy into Codex or use as an implementation request. Preparing this brief does not itself change or publish the website.

---

Act as a professional UI/UX designer, creative director and senior frontend engineer. Redesign the existing WorldBrief website into a distinctive, modern news discovery experience. Implement the redesign, inspect it in a real browser and refine the result until it works well visually and functionally.

## Project and scope

The project is at `C:\Users\PC\Documents\ChatGPT\News Website`, with a local preview at `http://localhost:3000/`. Read AGENTS.md, inspect the current working tree and follow the relevant installed Next.js documentation before editing. Preserve unrelated work. Keep the existing Next.js App Router, TypeScript, Tailwind CSS, routes, Currents integration, secret handling, cache behaviour and tests. This is a visual and usability redesign, not a rebuild of the backend.

WorldBrief is a personal, non-commercial English news aggregator by Shkamb. It helps visitors discover headlines and topics from around the world, then read the full articles at the original publisher. The current design is too subdued and text-heavy for the desired experience. At some intermediate widths, article columns have cramped spacing; inspect and fix that as part of the redesign.

Work locally. Do not push changes, publish a deployment, change account settings or start paid services as part of this redesign. Use free existing capabilities only. Report any unavailable asset-generation capability instead of purchasing services or starting trials.

## Reader and intended feeling

Design for curious everyday readers who want to find interesting news quickly on their phone or computer. The first impression should be: “This looks inviting. I can find my interests here. I want to explore.” The site should also feel credible, calm enough to read and clear about where each story comes from.

Design for a broad international audience. Shkamb has delegated the remaining creative decisions to your judgement; proceed without another style questionnaire. Translate that purpose into hierarchy, typography, imagery, layout and working interactions. Use warm, direct, confident language. Do not put design instructions or promotional claims about being user-friendly into the UI.

## Art direction: a bold, colourful world magazine

Create one coherent visual identity rather than a collection of trendy effects:

- Start with paper white `#F7F8FC` and deep ink `#121827` for reading, electric cobalt `#2458E8` for the main brand accent, vivid coral `#F16B55`, sunflower yellow `#F3CE45`, and teal `#1B968D` for selected topic treatments and artwork. Verify actual contrast; use darker variants for small coloured text. Use dark text on yellow and light coral surfaces.
- Let colour be a visible part of the design: a distinctive masthead treatment, a strong active-topic state, image-led topic blocks, and occasional editorial bands. Give each topic a consistent colour identity while keeping source metadata and reading areas clear. Avoid making every card a different bright background.
- Create energy through confident typography, strong image crops, varied scale and purposeful colour blocking. Keep long reading surfaces light and uncluttered.
- Pair an expressive editorial headline face with a clean, readable sans-serif for controls and metadata. Use at most two type families, available locally or properly licensed and self-hosted. Avoid runtime font dependencies where practical.
- Build a confident WorldBrief wordmark and a recognisable image language, with crisp alignment, deliberate whitespace, and modest corner rounding. The brand should be memorable even without animation.
- Keep reading text comfortable: around 16px for general copy, 13–14px for article metadata, and headlines scaled appropriately for each layout.
- Make individual cards feel useful and tactile through gentle colour changes, clear link styling and a small image response on hover. Match that feedback for keyboard focus.

Aim for the care of a professionally art-directed publication. Avoid generic gradient backgrounds, repeated glass panels, oversized empty heroes, decorative dashboards, excessive pill badges, and identical cards stretching endlessly down the page. Do not copy another publication's identity.

## Homepage and navigation

1. Use a compact header with WorldBrief, visible topic access, and a secondary About link. Move most portfolio and implementation explanation to About and the footer.
2. Use a brief welcome line such as “Your world. Your interests. Your next read.” Supporting copy should honestly explain that full stories open at the original source.
3. Bring “Latest headlines” and at least the first actual headline into the first viewport at approximately 375 × 812 and 1440 × 900. Let visitors see and access news immediately rather than scroll through a promotional landing page. Reduce welcome-section height if necessary; a large picture alone does not satisfy this requirement.
4. Create a strong opening news composition: one visually prominent latest item beside two or three compact headline items on wide screens. This prominence is layout hierarchy, not a claim of importance, popularity or editorial verification. Keep feed order intact.
5. Add an inviting “Explore your interests” section with six image-led topic links using the existing feeds. Use original imagery and clear topic names to invite exploration. Treat these as navigation, not six simultaneous provider fetches. Place it after the opening news composition so it helps discovery without pushing the first headlines down.
6. Continue with a varied but orderly article grid, using image-led cards where relevant and compact text cards for others. Avoid attaching the same image to every story.
7. Keep source domain, publication date, available author and the external-link affordance easy to identify. Headlines must still open the original article directly.
8. On phones, use a clear single-column hierarchy and accessible topic navigation. If topics scroll horizontally, make overflow discoverable and retain keyboard access. Do not hide the main browsing task behind several menu steps.
9. Give About, loading, empty, unavailable and not-found screens the same visual identity. Handle a single article and long headlines as carefully as a full feed.

All controls must work. Do not add a decorative search field, inactive bookmark button, login, subscription prompt, fake ticker, fabricated reader count or unimplemented personalisation. The existing six topic feeds are sufficient for this redesign.

## Original imagery

Use the available image-generation tool to produce a coordinated set of six original topic illustrations. Read its skill instructions before generating. These are editorial topic illustrations, not documentary evidence of news events.

Use an original visual style: exuberant editorial collage with carefully lit objects, tactile paper cutouts, bold geometric shapes and a coordinated cobalt/coral/yellow/teal palette. Combine recognisable subject matter with surprising composition and strong crops. Give every image a distinct composition and subject, avoiding glossy generic 3D icons, repetitive centred objects and generic stock-photo arrangements. Generate images without baked-in text, logos or interface elements. Keep text in HTML so it remains readable and accessible.

Suggested subjects:

- General: a conceptual world atlas, city fragments and routes connecting places.
- Technology & Science: optical instruments, a circuit fragment and a star field.
- Business: a marketplace, exchange paths and abstract economic forms; no invented financial data.
- Politics: a generic assembly space, civic architecture and discussion; no real politicians or party symbols.
- Sports: track markings, motion and anonymous sporting equipment; no invented match or team.
- Culture: books, theatre, music and a bold art print; no copied cover art or copyrighted characters.

Use wide compositions suitable for responsive cropping, with space around important subjects. Store the final assets locally under a dedicated public asset directory, optimise their size, and use responsive image loading. Reserve image dimensions to prevent layout jumps. Prioritise only genuinely above-the-fold media and lazy-load the remainder. Use CSS colour surfaces and a small number of original assets efficiently rather than generating one image per headline.

Prefer topic artwork in topic navigation and section headers. If artwork appears beside a specific headline, clearly label it “Topic illustration” and keep its subject generic. It must not imply that it depicts the people, place or event described by the article. Include accessible alternative text where the image contributes information; decorative artwork should have empty alt text. Explain generated topic artwork briefly on About.

Do not use publisher image URLs or assume that access to the news API grants image rights. Keep publisher descriptions omitted, as in the existing implementation. Do not generate event photographs, fake reporting, new headlines or AI summaries.

## Subtle interaction and motion

Shkamb chose images with subtle effects. Use restrained hover/focus transitions, around 150–220ms: a small image crop shift or zoom of up to roughly 2%, a clear headline underline or colour response, and understated button feedback. Keyboard focus must provide equally clear feedback. Touch navigation must work without hover.

Respect reduced-motion preferences and keep news stable while the reader scans it. Do not add video, continuously moving decorations, automatic carousels, scroll hijacking or an animated introduction. The visual appeal should come from the art direction, imagery and layout.

## Preserve trust and functionality

- Preserve the visible Sample content label whenever the fictional development fixtures are active.
- Preserve linked “Powered by Currents News API” attribution beside the news display and required source credits.
- Keep authenticated requests server-side with the private CURRENTS_API_KEY environment variable.
- Preserve the fixed seven feeds, fetching only the active feed, hourly shared caching and failure cooldowns. Keep internal topic prefetch disabled. Image changes must not add provider calls.
- Use “Latest headlines”; do not introduce unsupported “breaking,” “trending,” “verified,” “unbiased,” “most read,” geographic coverage guarantees, or false freshness claims.
- Keep real and fictional content distinct. An unavailable live feed must never silently turn into sample news.
- Maintain the original source links and news-content limitations; do not turn this into a full-article publication.

## Accessibility, responsiveness and verification

Check the actual local interface at 375px, 768px, the intermediate width around 840px, and 1440px. Inspect screenshots and fix problems, not just viewport metrics. Check:

- Distinctive visual hierarchy, comfortable reading, visible news in the opening viewport, and meaningful imagery.
- No overlapping columns, clipped headlines, unexpected horizontal page scrolling or excessive blank areas.
- Short and long headlines, missing authors/dates, one-item feeds, full feeds, empty results and provider errors.
- Keyboard topic navigation, clear focus, skip link, external article links and touch targets.
- Comfortable tap targets around 44px for primary controls, and clearly recognisable active topic and external-link states.
- Text contrast, reduced-motion behaviour, asset loading, correct crops and layout stability.
- Working topic and About navigation; no invented controls or unsupported content claims.

Run the existing lint, type checks, focused tests, production build, production smoke tests and secret scan. Add tests only if the redesign introduces behaviour that needs meaningful verification. Avoid changing the provider code merely to satisfy the new layout. Update README screenshots and the content-use note only as needed to accurately describe the final interface and original generated artwork.

Before finishing, inspect the final browser screenshots against this brief and refine any weak or unfinished area. Return a concise summary of the design changes, checks, asset provenance and remaining limitations. Provide the local preview URL and screenshots. Do not claim deployment or live API verification unless actually performed.
