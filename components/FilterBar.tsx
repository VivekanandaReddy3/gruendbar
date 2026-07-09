import Link from "next/link";
import { Users } from "lucide-react";
import { clsx } from "clsx";

import { CATEGORIES, SORT_OPTIONS, type SortValue } from "@/lib/constants";

export interface DirectoryFilters {
  query?: string;
  category?: string;
  team?: boolean;
  sort: SortValue;
}

const buildHref = (filters: DirectoryFilters, patch: Partial<DirectoryFilters>) => {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (next.query) params.set("query", next.query);
  if (next.category) params.set("category", next.category);
  if (next.team) params.set("team", "1");
  if (next.sort && next.sort !== "new") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
};

const FilterBar = ({ filters }: { filters: DirectoryFilters }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(filters, { category: undefined })}
          data-active={!filters.category}
          className={clsx(
            "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
            !filters.category
              ? "border-ink bg-ink text-paper"
              : "border-emerald-950/10 text-slate-500 hover:border-emerald-600 hover:text-emerald-700"
          )}
        >
          All
        </Link>
        {CATEGORIES.map((category) => {
          const active = filters.category?.toLowerCase() === category.toLowerCase();
          return (
            <Link
              key={category}
              href={buildHref(filters, { category: active ? undefined : category })}
              className={clsx(
                "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-emerald-950/10 text-slate-500 hover:border-emerald-600 hover:text-emerald-700"
              )}
            >
              {category}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={buildHref(filters, { team: !filters.team })}
          className={clsx(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
            filters.team
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-emerald-950/10 text-slate-500 hover:border-emerald-600 hover:text-emerald-700"
          )}
        >
          <Users className="size-3.5" />
          Looking for teammates
        </Link>

        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <span className="mr-1">sort:</span>
          {SORT_OPTIONS.map((option) => {
            const active = filters.sort === option.value;
            return (
              <Link
                key={option.value}
                href={buildHref(filters, { sort: option.value })}
                data-active={active}
                className={clsx(
                  "link-underline px-1 transition-colors",
                  active ? "text-ink" : "hover:text-slate-700"
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
