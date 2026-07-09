import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-10 pb-24 md:pt-14">{children}</main>
      <footer className="border-t-2 border-forest bg-forest text-cream">
        <div className="container-page flex flex-col gap-6 py-10">
          <p className="font-display text-4xl tracking-wide uppercase md:text-6xl">
            Gründbar<span className="text-lime">.</span>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-cream/70">
            <span>good ideas are foundable — pitch yours.</span>
            <span>
              built by{" "}
              <Link
                href="https://vivekreddy.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime underline decoration-2 underline-offset-4 transition-colors hover:text-cream"
              >
                Vivekananda Reddy
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
