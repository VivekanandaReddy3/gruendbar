import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-narrow flex flex-col items-start pt-16">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase">
        404 — Not found
      </p>
      <h1 className="reveal mt-3 text-4xl font-bold tracking-tight text-ink">
        This pitch doesn’t exist.
        <span
          className="mt-2 block font-serif text-2xl font-normal tracking-normal text-slate-500 italic"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          maybe it hasn’t been founded yet.
        </span>
      </h1>
      <Link
        href="/"
        className="group reveal mt-8 rounded-full bg-ink px-8 py-3 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        Back to the directory{" "}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </Link>
    </section>
  );
}
