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

const MARQUEE_ITEMS = [
  "Gründbar",
  "pitch",
  "upvote",
  "team up",
  "AI",
  "Climate",
  "Fintech",
  "SaaS",
  "Developer Tools",
  "found it",
];

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
        <p
          className="reveal font-mono text-[11px] font-semibold tracking-[0.25em] text-meadow uppercase"
          style={{ "--stagger": 0 } as React.CSSProperties}
        >
          Das Ideenregister — the startup idea registry
        </p>

        <h1
          className="reveal font-display mt-4 text-5xl leading-[0.95] tracking-wide text-forest uppercase sm:text-7xl md:text-8xl"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          Pitch your{" "}
          <span className="inline-block bg-lime px-2 sm:px-3">idea.</span>
          <br />
          Find your people.
        </h1>

        <p
          className="reveal mt-6 max-w-xl text-base text-forest/70 md:text-lg"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          Good ideas are <em className="not-italic underline decoration-lime decoration-4 underline-offset-2">gründbar</em> — foundable.
          Write the pitch, collect upvotes, and flag the teammates you need.
        </p>

        <div
          className="reveal mt-8 flex flex-wrap items-center gap-6"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <SearchForm query={query} />

          {stats && (
            <div className="flex font-mono text-xs">
              {(
                [
                  [stats.pitches, "pitches"],
                  [stats.founders, "founders"],
                  [stats.upvotes, "upvotes"],
                ] as const
              ).map(([value, label], i) => (
                <div
                  key={label}
                  className={`flex flex-col border-2 border-forest bg-card px-4 py-2 ${i > 0 ? "border-l-0" : ""}`}
                >
                  <span className="font-display text-xl text-forest">
                    {value}
                  </span>
                  <span className="text-[10px] tracking-widest text-forest/60 uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div
        className="reveal mt-12 overflow-hidden border-y-2 border-forest bg-forest py-2"
        style={{ "--stagger": 4 } as React.CSSProperties}
        aria-hidden
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="font-display px-6 text-lg tracking-widest whitespace-nowrap text-lime uppercase"
                >
                  {item} <span className="text-cream">✺</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="container-page mt-10">
        <FilterBar filters={filters} />

        <div className="mt-8 flex items-baseline justify-between border-b-2 border-forest pb-2">
          <h2 className="font-display text-2xl tracking-wide text-forest uppercase">
            {query
              ? `Results: “${query}”`
              : category
                ? category
                : filters.team
                  ? "Looking for teammates"
                  : "The register"}
          </h2>
          <span className="font-mono text-xs text-forest/60">
            {posts.length} {posts.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {posts.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="shadow-hard mt-8 border-2 border-forest bg-card px-6 py-16 text-center">
            {!isSanityConfigured || backendDown ? (
              <>
                <p className="font-display text-2xl text-forest uppercase">
                  Backend not connected
                </p>
                <p className="mt-2 font-mono text-xs text-forest/60">
                  Set the Sanity env vars (see README) and the register comes
                  alive.
                </p>
              </>
            ) : hasActiveFilters ? (
              <>
                <p className="font-display text-2xl text-forest uppercase">
                  Nothing filed here
                </p>
                <p className="mt-2 font-mono text-xs text-forest/60">
                  No pitches match those filters — try broadening them.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl text-forest uppercase">
                  The register is empty
                </p>
                <p className="mt-2 font-mono text-xs text-forest/60">
                  Sign in and file the first pitch.
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
