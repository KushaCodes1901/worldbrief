import type { Feed } from "./topics";
import type { FeedResult } from "./currents";

const stories = [
  [
    "general",
    "Imaginary city opens its first neighbourhood repair library",
    "Sample Civic Desk",
  ],
  [
    "technology",
    "Fictional research team shares a new map of the night sky",
    "Sample Science Desk",
  ],
  [
    "business",
    "Made-up cooperative turns unused spaces into local workshops",
    "Sample Business Desk",
  ],
  [
    "politics",
    "Imaginary council invites residents to help shape its next budget",
    "Sample Public Affairs Desk",
  ],
  [
    "sports",
    "Fictional runners bring a community relay to the riverside",
    "Sample Sports Desk",
  ],
  [
    "culture",
    "An invented exhibition explores the stories behind everyday objects",
    "Sample Culture Desk",
  ],
  [
    "technology",
    "Sample lab tests a quieter way to cool small computers",
    "Sample Science Desk",
  ],
  [
    "general",
    "Imaginary volunteers give an old walking trail a new chapter",
    "Sample Civic Desk",
  ],
  [
    "culture",
    "Fictional town celebrates a weekend of independent bookshops",
    "Sample Culture Desk",
  ],
  [
    "business",
    "Invented market makes room for a new generation of makers",
    "Sample Business Desk",
  ],
  [
    "sports",
    "Sample youth team opens its training sessions to beginners",
    "Sample Sports Desk",
  ],
  [
    "politics",
    "Fictional assembly publishes a plain-language guide to local decisions",
    "Sample Public Affairs Desk",
  ],
] as const;
export function sampleFeed(feed: Feed): FeedResult {
  return {
    status: "ok",
    sample: true,
    fetchedAt: "2026-10-06T12:00:00Z",
    articles: stories.flatMap(([category, title, author], index) =>
      feed !== "latest" && feed !== category
        ? []
        : [
            {
              id: `sample-${index}`,
              title,
              author,
              category,
              url: `https://example.com/#fictional-${index}`,
              sourceDomain: "example.com",
              publishedAt: `2026-10-06T${String(12 - Math.floor(index / 2)).padStart(2, "0")}:00:00Z`,
            },
          ],
    ),
  };
}
