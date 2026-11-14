import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div
        role="note"
        className="border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-center font-mono text-xs leading-relaxed text-amber-900"
      >
        <span className="mr-2 rounded-full bg-amber-200 px-2 py-0.5 font-semibold tracking-wide uppercase">
          Demo data
        </span>
        The seeded founders (Max Mustermann &amp; co.) and their pitches are
        invented examples, and the cover photos are random placeholders. Sign
        in with GitHub to post a real idea.
      </div>
      <Navbar />
      <main className="flex-1 pt-10 pb-20 md:pt-14">{children}</main>
      <footer className="container-page pb-8">
        <hr className="mb-4 border-emerald-950/10" />
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-500">
          <span>
            gründbar<span className="text-emerald-600">.</span> — good ideas
            are foundable
          </span>
          <span>
            built by{" "}
            <Link
              href="https://vivekreddy.de"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-slate-700 transition-colors hover:text-slate-950"
            >
              Vivekananda Reddy
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
