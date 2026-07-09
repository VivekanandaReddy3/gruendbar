"use server";

import { revalidatePath } from "next/cache";

import { safeAuth } from "@/auth";
import { isSanityConfigured } from "@/sanity/env";
import { writeClient } from "@/sanity/lib/write-client";
import { CATEGORIES, LOOKING_FOR_ROLES } from "@/lib/constants";

export interface CreatePitchState {
  status: "IDLE" | "ERROR" | "SUCCESS";
  errors: Partial<Record<string, string>>;
  id?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

const randomSuffix = () => Math.random().toString(36).slice(2, 7);

export async function createPitch(
  _prev: CreatePitchState,
  formData: FormData
): Promise<CreatePitchState> {
  const session = await safeAuth();
  const authorId = (session as { authorId?: string } | null)?.authorId;

  if (!session || !authorId) {
    return {
      status: "ERROR",
      errors: { form: "You need to sign in with GitHub to pitch." },
    };
  }

  if (!isSanityConfigured) {
    return {
      status: "ERROR",
      errors: { form: "Content backend is not configured yet." },
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const pitch = String(formData.get("pitch") ?? "").trim();
  const lookingFor = formData
    .getAll("lookingFor")
    .map(String)
    .filter((role) => (LOOKING_FOR_ROLES as readonly string[]).includes(role));

  const errors: Partial<Record<string, string>> = {};

  if (title.length < 3 || title.length > 80) {
    errors.title = "Title should be 3–80 characters.";
  }
  if (description.length < 10 || description.length > 200) {
    errors.description = "Tagline should be 10–200 characters.";
  }
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    errors.category = "Pick a category.";
  }
  try {
    const url = new URL(image);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    errors.image = "Cover image must be a valid URL.";
  }
  if (pitch.length < 50) {
    errors.pitch = "Tell us more — the pitch needs at least 50 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "ERROR", errors };
  }

  try {
    const created = await writeClient.create({
      _type: "startup",
      title,
      slug: { _type: "slug", current: `${slugify(title)}-${randomSuffix()}` },
      author: { _type: "reference", _ref: authorId },
      views: 0,
      voters: [],
      description,
      category,
      image,
      pitch,
      lookingFor,
    });

    revalidatePath("/");

    return { status: "SUCCESS", errors: {}, id: created._id };
  } catch (error) {
    console.error("createPitch failed:", error);
    return {
      status: "ERROR",
      errors: { form: "Something went wrong while saving. Try again." },
    };
  }
}

export interface UpvoteResult {
  upvotes: number;
  hasUpvoted: boolean;
  error?: string;
}

export async function toggleUpvote(startupId: string): Promise<UpvoteResult> {
  const session = await safeAuth();
  const authorId = (session as { authorId?: string } | null)?.authorId;

  if (!session || !authorId) {
    return { upvotes: 0, hasUpvoted: false, error: "SIGN_IN" };
  }

  try {
    const doc = await writeClient.fetch<{ voters?: string[] } | null>(
      `*[_type == "startup" && _id == $id][0]{ voters }`,
      { id: startupId }
    );

    if (!doc) {
      return { upvotes: 0, hasUpvoted: false, error: "NOT_FOUND" };
    }

    const voters = doc.voters ?? [];
    const hasUpvoted = voters.includes(authorId);

    if (hasUpvoted) {
      await writeClient
        .patch(startupId)
        .unset([`voters[@ == "${authorId}"]`])
        .commit();
    } else {
      await writeClient
        .patch(startupId)
        .setIfMissing({ voters: [] })
        .insert("after", "voters[-1]", [authorId])
        .commit();
    }

    revalidatePath(`/startup/${startupId}`);
    revalidatePath("/");

    return {
      upvotes: voters.length + (hasUpvoted ? -1 : 1),
      hasUpvoted: !hasUpvoted,
    };
  } catch (error) {
    console.error("toggleUpvote failed:", error);
    return { upvotes: 0, hasUpvoted: false, error: "FAILED" };
  }
}

export async function incrementViews(startupId: string): Promise<void> {
  if (!isSanityConfigured || !process.env.SANITY_WRITE_TOKEN) return;

  try {
    await writeClient
      .patch(startupId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();
  } catch (error) {
    console.error("incrementViews failed:", error);
  }
}
