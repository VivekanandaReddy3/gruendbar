export const CATEGORIES = [
  "AI",
  "SaaS",
  "Fintech",
  "Health",
  "Education",
  "Climate",
  "Developer Tools",
  "E-Commerce",
  "Social",
  "Other",
] as const;

export const LOOKING_FOR_ROLES = [
  "Co-founder",
  "Engineer",
  "Designer",
  "Marketing",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type LookingForRole = (typeof LOOKING_FOR_ROLES)[number];

export const SORT_OPTIONS = [
  { value: "new", label: "Newest" },
  { value: "upvotes", label: "Most upvoted" },
  { value: "views", label: "Most viewed" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
