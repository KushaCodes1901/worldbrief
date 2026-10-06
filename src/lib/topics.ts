export const topics = [
  { slug: "general", label: "General", category: "general" },
  { slug: "technology", label: "Technology & Science", category: "science_technology" },
  { slug: "business", label: "Business", category: "economy_business_finance" },
  { slug: "politics", label: "Politics", category: "politics_government" },
  { slug: "sports", label: "Sports", category: "sport" },
  { slug: "culture", label: "Culture", category: "arts_culture_entertainment" },
] as const;
export type Topic = (typeof topics)[number];
export type Feed = "latest" | Topic["slug"];
export function getTopic(value: string): Topic | undefined {
  return topics.find((topic) => topic.slug === value);
}
export function isFeed(value: string): value is Feed {
  return value === "latest" || getTopic(value) !== undefined;
}
