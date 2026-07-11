import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
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
