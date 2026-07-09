import { defineField, defineType } from "sanity";
import { RocketIcon } from "lucide-react";

import { CATEGORIES, LOOKING_FOR_ROLES } from "@/lib/constants";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(80),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Tagline",
      description: "One sentence — what does this startup do?",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: "category",
      type: "string",
      options: { list: [...CATEGORIES] },
      validation: (Rule) => Rule.required().error("Please pick a category"),
    }),
    defineField({
      name: "image",
      title: "Cover image URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      description: "The full pitch, in Markdown.",
      type: "markdown",
    }),
    defineField({
      name: "lookingFor",
      title: "Looking for",
      description: "Roles this founder wants to team up with.",
      type: "array",
      of: [{ type: "string" }],
      options: { list: [...LOOKING_FOR_ROLES] },
    }),
    defineField({
      name: "voters",
      description: "Author ids that upvoted this pitch. Managed by the app.",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
  ],
});
