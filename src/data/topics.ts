/**
 * IELTS Speaking Part 2 (cue card) topics, organized by category.
 *
 * Each category contains 5–6 real cue-card style topics. Topics are styled after
 * genuine IELTS prompts ("Describe a … / Describe a time you …"), giving students
 * enough to talk about for the full 1–2 minute Part 2 monologue.
 *
 * DATA NOTE: This file is deliberately data-only so the topic library can be
 * expanded, reordered, or filtered without touching any UI code.
 */

export interface TopicCategory {
  /** Stable URL/state identifier (slug). */
  id: string;
  /** Human-readable category name shown on the dashboard. */
  label: string;
  /** One-line description shown under the category title. */
  description: string;
  /** Topics in this category. */
  topics: readonly string[];
}

export const topicCategories: readonly TopicCategory[] = [
  {
    id: "family",
    label: "Family & Relationships",
    description: "People who matter to you: family, friends, and mentors.",
    topics: [
      "Describe a family member you are closest to",
      "Describe a friend who has been important in your life",
      "Describe a wedding you attended",
      "Describe an older person you admire",
      "Describe a person who has influenced your life",
      "Describe a family celebration that was special to you",
      "Describe a family member you admire",
    ],
  },
  {
    id: "education",
    label: "Education & Study",
    description: "Teachers, subjects, courses, and learning experiences.",
    topics: [
      "Describe a teacher who had a big influence on you",
      "Describe a subject you enjoyed at school",
      "Describe a skill you would like to learn",
      "Describe a course or class you found useful",
      "Describe an important decision you made about your studies",
      "Describe a teacher who influenced you",
    ],
  },
  {
    id: "work",
    label: "Work & Career",
    description: "Jobs, ambitions, and the world of work.",
    topics: [
      "Describe a job you would like to have in the future",
      "Describe a person who is good at their job",
      "Describe a time you worked hard to achieve something",
      "Describe a business you would like to start",
      "Describe a skill that is important for your career",
    ],
  },
  {
    id: "travel",
    label: "Travel & Places",
    description: "Journeys, cities, and places you have seen or want to see.",
    topics: [
      "Describe a place you visited that impressed you",
      "Describe a memorable journey you have taken",
      "Describe a beautiful place you have seen",
      "Describe a city you would like to visit",
      "Describe a hotel or place you stayed that you remember",
      "Describe a country you would like to visit",
    ],
  },
  {
    id: "technology",
    label: "Technology & Media",
    description: "Gadgets, apps, websites, films, and other media.",
    topics: [
      "Describe a piece of technology you use regularly",
      "Describe an app you find useful",
      "Describe a website you visit often",
      "Describe a film or TV programme you enjoyed",
      "Describe a time you used technology to help someone",
      "Describe a piece of technology you find useful",
    ],
  },
  {
    id: "hobbies",
    label: "Hobbies & Free Time",
    description: "How you relax, play, and spend your spare time.",
    topics: [
      "Describe a hobby you enjoy doing",
      "Describe a sport you like playing or watching",
      "Describe a book you would like to read again",
      "Describe something you do to relax",
      "Describe a musical instrument you would like to learn",
      "Describe a weekend activity you enjoy",
      "Describe an outdoor activity you enjoy",
    ],
  },
  {
    id: "health",
    label: "Health & Lifestyle",
    description: "Fitness, food, habits, and staying well.",
    topics: [
      "Describe a healthy habit you have",
      "Describe a time you improved your fitness or health",
      "Describe a meal you particularly enjoy eating",
      "Describe an activity you do to keep fit",
      "Describe a time you recovered from an illness or injury",
    ],
  },
  {
    id: "environment",
    label: "Environment & Nature",
    description: "The natural world and the challenges it faces.",
    topics: [
      "Describe an environmental problem in your area",
      "Describe a plant or animal you find interesting",
      "Describe a walk you took in a natural place",
      "Describe a way people can protect the environment",
      "Describe a natural place you would like to visit",
      "Describe an environmental problem in your country",
    ],
  },
  {
    id: "culture",
    label: "Culture & Society",
    description: "Traditions, festivals, history, and the arts.",
    topics: [
      "Describe a tradition from your country that you enjoy",
      "Describe a festival or celebration in your country",
      "Describe a historical building or site you have visited",
      "Describe a piece of art or music that means a lot to you",
      "Describe a dish that is typical of your country",
      "Describe a traditional festival in your country",
    ],
  },
  {
    id: "memories",
    label: "Memorable Experiences",
    description: "Moments and events that stayed with you.",
    topics: [
      "Describe an event you attended that made you happy",
      "Describe an important decision you made in your life",
      "Describe a time you helped someone",
      "Describe a time you overcame a difficult challenge",
      "Describe a memorable day you spent with family or friends",
      "Describe a memorable trip you took",
    ],
  },
  {
    id: "shopping",
    label: "Money & Shopping",
    description: "Buying, saving, and the things money can buy.",
    topics: [
      "Describe something you bought that you were pleased with",
      "Describe a shop or market you like to visit",
      "Describe a time you saved money for something special",
      "Describe something expensive you would like to buy in the future",
      "Describe a present you gave to someone",
      "Describe something you bought that you were happy with",
    ],
  },
];

/** Every topic across all categories (useful for search or validation). */
export function getAllTopics(): string[] {
  return topicCategories.flatMap((category) => [...category.topics]);
}