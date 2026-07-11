import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github } from "lucide-react";

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
        className="reveal flex flex-wrap items-center gap-5"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        {founder.image ? (
          <Image
            src={founder.image}
            alt={founder.name ?? "Founder"}
            width={72}
            height={72}
            className="rounded-2xl border border-emerald-950/10 shadow-card"
          />
        ) : (
          <span className="flex size-[72px] items-center justify-center rounded-2xl bg-emerald-100 font-mono text-2xl text-emerald-900">
            {(founder.name ?? "?").charAt(0)}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {founder.name}
            {isOwnProfile && (
              <span className="ml-3 align-middle font-mono text-[10px] tracking-widest text-emerald-700 uppercase">
                — this is you
              </span>
            )}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-400">
            {founder.username && (
              <a
                href={`https://github.com/${founder.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline flex items-center gap-1.5 transition-colors hover:text-slate-950"
              >
                <Github className="size-3.5" />@{founder.username}
              </a>
            )}
            <span>
              {startups.length} {startups.length === 1 ? "pitch" : "pitches"}
            </span>
          </p>
        </div>
      </header>

      {founder.bio && (
        <p
          className="reveal mt-6 max-w-2xl border-l-[3px] border-lime-300 pl-4 text-slate-600"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {founder.bio}
        </p>
      )}

      <div
        className="reveal mt-12"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
          Pitches by {founder.name?.split(" ")[0] ?? "this founder"}
        </p>

        {startups.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-2xl border border-dashed border-emerald-950/15 px-6 py-14 text-center">
            <p className="text-lg font-medium text-ink">No pitches yet</p>
            {isOwnProfile ? (
              <p className="mt-1 text-sm">
                <Link href="/create" className="link-underline font-medium text-emerald-800">
                  Start your first pitch →
                </Link>
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Nothing published yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FounderPage;
