import Link from "next/link";
import { clsx } from "clsx";

import { CATEGORIES, SORT_OPTIONS, type SortValue } from "@/lib/constants";

export interface DirectoryFilters {
  query?: string;
  category?: string;
  team?: boolean;
  sort: SortValue;
}

const buildHref = (
  filters: DirectoryFilters,
  patch: Partial<DirectoryFilters>
) => {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (next.query) params.set("query", next.query);
  if (next.category) params.set("category", next.category);
  if (next.team) params.set("team", "1");
  if (next.sort && next.sort !== "new") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
};

const chipClass = (active: boolean) =>
  clsx(
    "border-2 border-forest px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors",
    active ? "bg-forest text-cream" : "bg-card text-forest hover:bg-lime"
  );

const FilterBar = ({ filters }: { filters: DirectoryFilters }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref(filters, { category: undefined })}
          className={chipClass(!filters.category)}
        >
          All
        </Link>
        {CATEGORIES.map((category) => {
          const active =
            filters.category?.toLowerCase() === category.toLowerCase();
          return (
            <Link
              key={category}
              href={buildHref(filters, {
                category: active ? undefined : category,
              })}
              className={chipClass(active)}
            >
              {category}
            </Link>
          );
        })}
        <Link
          href={buildHref(filters, { team: !filters.team })}
          className={clsx(
            "border-2 border-forest px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors",
            filters.team
              ? "bg-lime text-forest"
              : "bg-card text-forest hover:bg-lime"
          )}
        >
          ✚ Looking for teammates
        </Link>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] text-forest/50 uppercase">
        <span className="tracking-widest">Sort</span>
        {SORT_OPTIONS.map((option) => {
          const active = filters.sort === option.value;
          return (
            <Link
              key={option.value}
              href={buildHref(filters, { sort: option.value })}
              className={clsx(
                "underline-offset-4 transition-colors",
                active
                  ? "font-semibold text-forest underline decoration-lime decoration-4"
                  : "hover:text-forest"
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
