import { topics, type Topic } from "./topics";

// Presentation only: this mapping never requests another news feed.
export const topicArt = {
  general: { name: "The wider world", note: "People, places & perspectives" },
  technology: {
    name: "Ideas shaping tomorrow",
    note: "Discovery, science & technology",
  },
  business: { name: "A world in exchange", note: "Markets, work & enterprise" },
  politics: {
    name: "The public conversation",
    note: "Decisions, policy & people",
  },
  sports: {
    name: "More than the score",
    note: "Movement, competition & community",
  },
  culture: {
    name: "A little inspiration",
    note: "Art, books & everyday culture",
  },
} as const;

export function articleTopic(category: string): Topic | undefined {
  return topics.find(
    (topic) => topic.slug === category || topic.category === category,
  );
}
