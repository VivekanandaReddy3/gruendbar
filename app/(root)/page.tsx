import StartupCard from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";
import FilterBar, { type DirectoryFilters } from "@/components/FilterBar";
import { startupsQuery } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { isSanityConfigured } from "@/sanity/env";
import { SORT_OPTIONS, type SortValue } from "@/lib/constants";
import type { StartupItem } from "@/lib/types";

const isSortValue = (value: string | undefined): value is SortValue =>
  SORT_OPTIONS.some((option) => option.value === value);

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
  let backendDown = false;

  if (isSanityConfigured) {
    try {
      const { data } = await sanityFetch({
        query: startupsQuery(filters.sort),
        params: {
          search: query ? `*${query}*` : null,
          category: category || null,
          team: filters.team ? true : null,
        },
      });
      posts = data ?? [];
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
            className="reveal mb-5 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-slate-500 uppercase"
            style={{ "--stagger": 0 } as React.CSSProperties}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            The startup idea directory
          </p>

          <h1
            className="reveal text-4xl font-bold tracking-tight text-ink md:text-5xl"
            style={{ "--stagger": 1 } as React.CSSProperties}
          >
            Pitch your idea.
            <br />
            Find your people.
            <span className="mt-3 block font-serif text-2xl font-normal tracking-normal text-slate-500 italic md:text-3xl">
              because good ideas are gründbar — foundable.
            </span>
          </h1>

          <div
            className="reveal mt-8"
            style={{ "--stagger": 2 } as React.CSSProperties}
          >
            <SearchForm query={query} />
          </div>
        </div>

        <div
          className="reveal mt-10"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <FilterBar filters={filters} />
        </div>
      </section>

      <section className="container-page mt-10">
        <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
          {query
            ? `Results for “${query}”`
            : category
              ? `${category} pitches`
              : filters.team
                ? "Founders looking for teammates"
                : "All pitches"}
          {posts.length > 0 && ` — ${posts.length}`}
        </p>

        {posts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <StartupCard key={post._id} post={post} stagger={Math.min(i, 8)} />
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
                  Set the Sanity environment variables (see README) and this
                  directory comes alive.
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
                <p className="mt-1 font-serif text-base text-slate-500 italic">
                  sign in and start a pitch.
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
