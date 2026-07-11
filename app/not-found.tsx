import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-narrow flex flex-col items-start pt-16">
      <p className="reveal flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-emerald-700 uppercase">
        <span aria-hidden className="text-sm leading-none">✳</span>
        404 — Not found
      </p>
      <h1
        className="reveal mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        Nicht <span className="mark">gründbar.</span>
      </h1>
      <p
        className="reveal mt-3 text-lg text-slate-600"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        This page isn’t foundable — maybe the idea behind it is.
      </p>
      <Link
        href="/"
        className="group reveal mt-8 rounded-lg bg-ink px-6 py-3 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover"
        style={{ "--stagger": 3 } as React.CSSProperties}
      >
        Back to the register{" "}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </Link>
    </section>
  );
}
