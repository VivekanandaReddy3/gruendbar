import Image from "next/image";
import Link from "next/link";
import { safeAuth, signIn, signOut } from "@/auth";

const Navbar = async () => {
  const session = await safeAuth();
  const authorId = (session as { authorId?: string } | null)?.authorId;

  return (
    <header className="sticky top-0 z-50 bg-[#fafdf9]/80 backdrop-blur-md">
      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-ink"
        >
          gründbar<span className="text-emerald-600">.</span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-5">
          {session?.user ? (
            <>
              <Link
                href="/create"
                className="rounded-lg bg-ink px-5 py-2 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover"
              >
                Start a pitch
              </Link>

              {authorId && (
                <Link
                  href={`/founder/${authorId}`}
                  className="flex items-center gap-2"
                  title="Your profile"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "Your avatar"}
                      width={30}
                      height={30}
                      className="rounded-full border border-emerald-950/10"
                    />
                  ) : (
                    <span className="flex size-[30px] items-center justify-center rounded-full bg-emerald-100 font-mono text-xs text-emerald-900">
                      {(session.user.name ?? "?").charAt(0)}
                    </span>
                  )}
                </Link>
              )}

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="link-underline cursor-pointer font-mono text-xs text-slate-500 transition-colors hover:text-slate-950"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-ink px-5 py-2 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover"
              >
                Sign in with GitHub
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
