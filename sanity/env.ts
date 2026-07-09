export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-30";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Falls back to a placeholder so the app builds and renders empty states
// before a Sanity project is connected. See README → Setup.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

export const token = process.env.SANITY_WRITE_TOKEN;

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);
