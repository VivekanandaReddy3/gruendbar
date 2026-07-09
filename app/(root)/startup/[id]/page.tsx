import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";

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
        className="reveal inline-block font-mono text-xs font-semibold tracking-widest text-forest/60 uppercase underline decoration-2 underline-offset-4 transition-colors hover:text-forest"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        ← Back to the register
      </Link>

      <header
        className="reveal mt-6"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-forest/50">
          <time dateTime={post._createdAt}>{formatDate(post._createdAt)}</time>
          <Suspense fallback={<span>… views</span>}>
            <View id={id} />
          </Suspense>
          {post.category && (
            <Link
              href={`/?category=${encodeURIComponent(post.category)}`}
              className="border-2 border-forest bg-cream px-2 py-0.5 font-semibold tracking-wider text-forest uppercase transition-colors hover:bg-lime"
            >
              {post.category}
            </Link>
          )}
        </p>

        <h1 className="font-display mt-4 text-5xl leading-[0.95] tracking-wide text-forest uppercase md:text-6xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 border-l-4 border-lime pl-4 text-lg text-forest/70">
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
              className="border-2 border-forest"
            />
          ) : (
            <span className="flex size-11 items-center justify-center border-2 border-forest bg-forest font-mono text-sm text-cream">
              {(post.author?.name ?? "?").charAt(0)}
            </span>
          )}
          <span>
            <span className="block text-sm font-bold text-forest underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-lime">
              {post.author?.name}
            </span>
            {post.author?.username && (
              <span className="font-mono text-xs text-forest/50">
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
          className="reveal shadow-hard mt-8 border-2 border-forest"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title ?? "Cover"} className="block w-full" />
        </div>
      )}

      {post.lookingFor && post.lookingFor.length > 0 && (
        <aside
          className="reveal shadow-hard mt-8 border-2 border-forest bg-lime p-5"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          <p className="font-mono text-[11px] font-semibold tracking-[0.25em] text-forest uppercase">
            ✚ This founder is looking for
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.lookingFor.map((role) => (
              <span
                key={role}
                className="border-2 border-forest bg-cream px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-forest uppercase"
              >
                {role}
              </span>
            ))}
          </div>
          {post.author?.username && (
            <p className="mt-4 text-sm text-forest">
              Interested?{" "}
              <a
                href={`https://github.com/${post.author.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline decoration-2 underline-offset-4"
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
        <h2 className="font-display border-b-2 border-forest pb-2 text-2xl tracking-wide text-forest uppercase">
          The pitch
        </h2>
        {parsedContent ? (
          <div
            className="prose mt-6 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-forest prose-p:text-forest/80 prose-strong:text-forest prose-a:font-semibold prose-a:text-meadow prose-li:text-forest/80"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="mt-6 font-mono text-sm text-forest/50">
            No details filed yet.
          </p>
        )}
      </div>
    </article>
  );
};

export default StartupPage;
