import Form from "next/form";
import { Search, X } from "lucide-react";
import Link from "next/link";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form
      action="/"
      scroll={false}
      className="flex w-full max-w-xl items-center gap-2 rounded-full border border-emerald-950/15 bg-white py-1.5 pr-1.5 pl-5 shadow-card transition-shadow focus-within:shadow-card-hover"
    >
      <Search className="size-4 shrink-0 text-slate-400" />
      <input
        name="query"
        defaultValue={query}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        placeholder="Search ideas, categories, founders…"
      />
      {query && (
        <Link
          href="/"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Link>
      )}
      <button
        type="submit"
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-emerald-900"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
    </Form>
  );
};

export default SearchForm;
