import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-narrow flex flex-col items-start pt-16">
      <p className="reveal font-mono text-[11px] font-semibold tracking-[0.25em] text-meadow uppercase">
        404 — Not found
      </p>
      <h1
        className="reveal font-display mt-4 text-6xl leading-[0.95] tracking-wide text-forest uppercase md:text-7xl"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        Nicht{" "}
        <span className="inline-block bg-lime px-2">gründbar.</span>
      </h1>
      <p
        className="reveal mt-4 text-forest/70"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        This page isn’t foundable — maybe the idea behind it is.
      </p>
      <Link
        href="/"
        className="reveal hover-lift shadow-hard mt-8 border-2 border-forest bg-lime px-6 py-2.5 font-mono text-xs font-semibold tracking-wide text-forest uppercase"
        style={{ "--stagger": 3 } as React.CSSProperties}
      >
        Back to the register →
      </Link>
    </section>
  );
}
