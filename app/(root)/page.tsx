import StartupCard from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";
import FilterBar, { type DirectoryFilters } from "@/components/FilterBar";
import { startupsQuery } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { SORT_OPTIONS, type SortValue } from "@/lib/constants";
import type { StartupItem } from "@/lib/types";

const isSortValue = (value: string | undefined): value is SortValue =>
  SORT_OPTIONS.some((option) => option.value === value);

interface Stats {
  pitches: number;
  founders: number;
  upvotes: number;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    team?: string;
    sort?: string;
  }>;
}) {
  const { query, category, team, sort } = await searchParams;

  const filters: DirectoryFilters = {
    query,
    category,
    team: team === "1",
    sort: isSortValue(sort) ? sort : "new",
  };

  let posts: StartupItem[] = [];
  let stats: Stats | null = null;
  let backendDown = false;

  if (isSanityConfigured) {
    try {
      const [{ data }, statsResult] = await Promise.all([
        sanityFetch({
          query: startupsQuery(filters.sort),
          params: {
            search: query ? `*${query}*` : null,
            category: category || null,
            team: filters.team ? true : null,
          },
        }),
        client.fetch<Stats>(
          `{
            "pitches": count(*[_type == "startup"]),
            "founders": count(*[_type == "author"]),
            "upvotes": count(*[_type == "startup"].voters[])
          }`
        ),
      ]);
      posts = data ?? [];
      stats = statsResult;
    } catch (error) {
      console.error("Directory fetch failed:", error);
      backendDown = true;
    }
  }

  const hasActiveFilters = Boolean(query || category || filters.team);

  return (
    <>
      <section className="container-page">
        <div className="max-w-2xl">
          <p
            className="reveal mb-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-emerald-700 uppercase"
            style={{ "--stagger": 0 } as React.CSSProperties}
          >
            <span aria-hidden className="text-sm leading-none">✳</span>
            Das Ideenregister — the startup idea registry
          </p>

          <h1
            className="reveal text-4xl font-bold tracking-tight text-ink md:text-5xl"
            style={{ "--stagger": 1 } as React.CSSProperties}
          >
            Pitch your <span className="mark">idea.</span>
            <br />
            Find your people.
          </h1>

          <p
            className="reveal mt-4 text-lg text-slate-600"
            style={{ "--stagger": 2 } as React.CSSProperties}
          >
            Good ideas are gründbar — <span className="mark">foundable</span>.
            Write the pitch, collect upvotes, and flag the teammates you need.
          </p>

          <div
            className="reveal mt-8 flex flex-wrap items-center gap-x-8 gap-y-5"
            style={{ "--stagger": 3 } as React.CSSProperties}
          >
            <SearchForm query={query} />

            {stats && (
              <dl className="flex gap-6">
                {(
                  [
                    [stats.pitches, "pitches"],
                    [stats.founders, "founders"],
                    [stats.upvotes, "upvotes"],
                  ] as const
                ).map(([value, label]) => (
                  <div key={label} className="flex flex-col">
                    <dd className="text-xl font-bold tracking-tight text-emerald-800 tabular-nums">
                      {value}
                    </dd>
                    <dt className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div
          className="reveal mt-10"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          <FilterBar filters={filters} />
        </div>
      </section>

      <section className="container-page mt-10">
        <p className="mb-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
          <span aria-hidden className="text-emerald-600">✳</span>
          {query
            ? `Results for “${query}”`
            : category
              ? `${category} pitches`
              : filters.team
                ? "Founders looking for teammates"
                : "The register"}
          {posts.length > 0 && ` — ${posts.length}`}
        </p>

        {posts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <StartupCard
                key={post._id}
                post={post}
                index={i}
                stagger={Math.min(i, 8)}
              />
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-950/15 px-6 py-16 text-center">
            {!isSanityConfigured || backendDown ? (
              <>
                <p className="text-lg font-medium text-ink">
                  Content backend not connected
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Set the Sanity environment variables (see README) and the
                  register comes alive.
                </p>
              </>
            ) : hasActiveFilters ? (
              <>
                <p className="text-lg font-medium text-ink">Nothing here yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  No pitches match those filters — try broadening them.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-ink">
                  No pitches yet — yours could be the first
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Sign in and start a pitch.
                </p>
              </>
            )}
          </div>
        )}
      </section>

      {isSanityConfigured && <SanityLive />}
    </>
  );
}
