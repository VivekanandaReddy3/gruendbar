import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { safeAuth } from "@/auth";
import type { FounderRef, StartupItem } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import {
  AUTHOR_BY_ID_QUERY,
  STARTUPS_BY_AUTHOR_QUERY,
} from "@/sanity/lib/queries";
import { isSanityConfigured } from "@/sanity/env";
import StartupCard from "@/components/StartupCard";

const FounderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!isSanityConfigured) return notFound();

  let founder: FounderRef | null = null;
  let startups: StartupItem[] = [];

  try {
    [founder, startups] = await Promise.all([
      client.fetch(AUTHOR_BY_ID_QUERY, { id }),
      client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id }),
    ]);
  } catch (error) {
    console.error("Founder fetch failed:", error);
  }
  if (!founder) return notFound();

  const session = await safeAuth();
  const isOwnProfile =
    (session as { authorId?: string } | null)?.authorId === founder._id;

  return (
    <section className="container-page">
      <header
        className="reveal flex flex-wrap items-center gap-6"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        {founder.image ? (
          <Image
            src={founder.image}
            alt={founder.name ?? "Founder"}
            width={84}
            height={84}
            className="shadow-hard border-2 border-forest"
          />
        ) : (
          <span className="shadow-hard flex size-[84px] items-center justify-center border-2 border-forest bg-forest font-display text-3xl text-cream">
            {(founder.name ?? "?").charAt(0)}
          </span>
        )}
        <div>
          <h1 className="font-display text-4xl tracking-wide text-forest uppercase md:text-5xl">
            {founder.name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-4 font-mono text-xs text-forest/60">
            {isOwnProfile && (
              <span className="border-2 border-forest bg-lime px-2 py-0.5 font-semibold tracking-widest text-forest uppercase">
                this is you
              </span>
            )}
            {founder.username && (
              <a
                href={`https://github.com/${founder.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-4 transition-colors hover:text-forest"
              >
                @{founder.username}
              </a>
            )}
            <span>
              {startups.length} {startups.length === 1 ? "pitch" : "pitches"} filed
            </span>
          </p>
        </div>
      </header>

      {founder.bio && (
        <p
          className="reveal mt-6 max-w-2xl border-l-4 border-lime pl-4 text-forest/70"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {founder.bio}
        </p>
      )}

      <div
        className="reveal mt-12"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        <h2 className="font-display border-b-2 border-forest pb-2 text-2xl tracking-wide text-forest uppercase">
          Filed pitches
        </h2>

        {startups.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {startups.map((post, i) => (
              <StartupCard
                key={post._id}
                post={post}
                index={i}
                stagger={Math.min(i, 8)}
              />
            ))}
          </ul>
        ) : (
          <div className="shadow-hard mt-8 border-2 border-forest bg-card px-6 py-14 text-center">
            <p className="font-display text-2xl text-forest uppercase">
              Nothing filed yet
            </p>
            {isOwnProfile ? (
              <Link
                href="/create"
                className="mt-3 inline-block font-mono text-xs font-semibold tracking-widest text-meadow uppercase underline decoration-2 underline-offset-4"
              >
                File your first pitch →
              </Link>
            ) : (
              <p className="mt-2 font-mono text-xs text-forest/50">
                No pitches published.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderPage;
