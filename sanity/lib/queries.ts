import { defineQuery } from "next-sanity";
import type { SortValue } from "@/lib/constants";

const CARD_PROJECTION = `{
  _id,
  title,
  slug,
  _createdAt,
  author -> { _id, name, username, image },
  views,
  description,
  category,
  image,
  lookingFor,
  "upvotes": count(coalesce(voters, []))
}`;

const ORDER_BY: Record<SortValue, string> = {
  new: "| order(_createdAt desc)",
  upvotes: "| order(upvotes desc, _createdAt desc)",
  views: "| order(coalesce(views, 0) desc, _createdAt desc)",
};

/**
 * Directory listing with search, category and team-up filters plus
 * selectable ordering. Params: $search, $category, $team (all nullable).
 */
export const startupsQuery = (sort: SortValue = "new") => `
  *[_type == "startup" && defined(slug.current)
    && (!defined($search) || title match $search || description match $search || category match $search || author->name match $search)
    && (!defined($category) || lower(category) == lower($category))
    && (!defined($team) || count(coalesce(lookingFor, [])) > 0)
  ] ${CARD_PROJECTION} ${ORDER_BY[sort] ?? ORDER_BY.new}`;

export const STARTUP_BY_ID_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
    _id,
    title,
    slug,
    _createdAt,
    author -> { _id, name, username, image, bio, email },
    views,
    description,
    category,
    image,
    pitch,
    lookingFor,
    voters,
    "upvotes": count(coalesce(voters, []))
  }`);

export const STARTUP_VIEWS_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{ _id, views }`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
    _id, id, name, username, email, image, bio
  }`);

export const STARTUPS_BY_AUTHOR_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current) && author._ref == $id]
  ${CARD_PROJECTION} | order(_createdAt desc)`);
