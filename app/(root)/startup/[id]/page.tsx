import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { Users } from "lucide-react";

import { safeAuth } from "@/auth";
import { formatDate } from "@/lib/utils";
import type { StartupDetail } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { isSanityConfigured } from "@/sanity/env";
import View from "@/components/View";
import UpvoteButton from "@/components/UpvoteButton";

const md = markdownit();

const StartupPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!isSanityConfigured) return notFound();

  let post: StartupDetail | null = null;
  try {
    post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  } catch (error) {
    console.error("Pitch fetch failed:", error);
  }
  if (!post) return notFound();

  const session = await safeAuth();
  const authorId = (session as { authorId?: string } | null)?.authorId;
  const hasUpvoted = Boolean(authorId && post.voters?.includes(authorId));

  const parsedContent = md.render(post.pitch || "");

  return (
    <article className="container-narrow">
      <Link
        href="/"
        className="group reveal mb-8 inline-block font-mono text-xs text-slate-500 transition-colors hover:text-slate-950"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>{" "}
        Directory
      </Link>

      <header
        className="reveal"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        <p className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
          <time dateTime={post._createdAt}>{formatDate(post._createdAt)}</time>
          <Suspense fallback={<span>… views</span>}>
            <View id={id} />
          </Suspense>
          {post.category && (
            <Link
              href={`/?category=${encodeURIComponent(post.category)}`}
              className="rounded-full border border-emerald-950/10 px-2.5 py-0.5 text-[10px] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              {post.category}
            </Link>
          )}
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 border-l-[3px] border-lime-300 pl-4 text-lg text-slate-600 md:text-xl">
            {post.description}
          </p>
        )}
      </header>

      <div
        className="reveal mt-8 flex flex-wrap items-center justify-between gap-4"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        <Link
          href={`/founder/${post.author?._id}`}
          className="group flex items-center gap-3"
        >
          {post.author?.image ? (
            <Image
              src={post.author.image}
              alt={post.author?.name ?? "Founder"}
              width={44}
              height={44}
              className="rounded-full border border-emerald-950/10"
            />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 font-mono text-sm text-emerald-900">
              {(post.author?.name ?? "?").charAt(0)}
            </span>
          )}
          <span>
            <span className="link-underline block text-sm font-semibold text-ink">
              {post.author?.name}
            </span>
            {post.author?.username && (
              <span className="font-mono text-xs text-slate-400">
                @{post.author.username}
              </span>
            )}
          </span>
        </Link>

        <UpvoteButton
          startupId={post._id}
          initialUpvotes={post.upvotes ?? 0}
          initialHasUpvoted={hasUpvoted}
          signedIn={Boolean(session)}
        />
      </div>

      {post.image && (
        <div
          className="reveal mt-8 overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-50 shadow-card"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title ?? "Cover"} className="w-full" />
        </div>
      )}

      {post.lookingFor && post.lookingFor.length > 0 && (
        <aside
          className="reveal mt-8 rounded-2xl border border-emerald-600/30 bg-emerald-50/60 p-5"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-emerald-800 uppercase">
            <Users className="size-4" />
            This founder is looking for
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.lookingFor.map((role) => (
              <span
                key={role}
                className="rounded-full bg-emerald-600 px-3 py-1 font-mono text-[11px] text-white"
              >
                {role}
              </span>
            ))}
          </div>
          {post.author?.username && (
            <p className="mt-4 text-sm text-slate-600">
              Interested?{" "}
              <a
                href={`https://github.com/${post.author.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-medium text-emerald-800"
              >
                Reach out to @{post.author.username} →
              </a>
            </p>
          )}
        </aside>
      )}

      <div
        className="reveal mt-10"
        style={{ "--stagger": 5 } as React.CSSProperties}
      >
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
          <span aria-hidden className="text-emerald-600">✳</span>
          The pitch
        </p>
        {parsedContent ? (
          <div
            className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-700"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="font-mono text-sm text-slate-400">
            No details filed yet.
          </p>
        )}
      </div>
    </article>
  );
};

export default StartupPage;
