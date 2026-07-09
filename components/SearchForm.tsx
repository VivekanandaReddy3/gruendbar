import Form from "next/form";
import { Search, X } from "lucide-react";
import Link from "next/link";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form
      action="/"
      scroll={false}
      className="shadow-hard flex w-full max-w-md border-2 border-forest bg-card"
    >
      <input
        name="query"
        defaultValue={query}
        className="w-full bg-transparent px-4 py-2.5 font-mono text-sm text-forest outline-none placeholder:text-forest/40"
        placeholder="Search the register…"
      />
      {query && (
        <Link
          href="/"
          className="flex items-center border-l-2 border-forest px-3 text-forest/50 transition-colors hover:bg-forest/5 hover:text-forest"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Link>
      )}
      <button
        type="submit"
        className="flex cursor-pointer items-center border-l-2 border-forest bg-lime px-4 text-forest transition-colors hover:bg-meadow hover:text-cream"
        aria-label="Search"
      >
        <Search className="size-4" />
      </button>
    </Form>
  );
};

export default SearchForm;
