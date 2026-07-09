import Image from "next/image";
import Link from "next/link";
import { safeAuth, signIn, signOut } from "@/auth";

const Navbar = async () => {
  const session = await safeAuth();
  const authorId = (session as { authorId?: string } | null)?.authorId;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-forest bg-cream">
      <div className="container-page flex items-center justify-between py-3">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-forest uppercase"
        >
          Gründbar<span className="text-meadow">.</span>
        </Link>

        <nav className="flex items-center gap-3 md:gap-4">
          {session?.user ? (
            <>
              <Link
                href="/create"
                className="hover-lift shadow-hard-sm border-2 border-forest bg-lime px-4 py-1.5 font-mono text-xs font-semibold tracking-wide text-forest uppercase"
              >
                Start a pitch
              </Link>

              {authorId && (
                <Link
                  href={`/founder/${authorId}`}
                  className="hover-lift shadow-hard-sm border-2 border-forest"
                  title="Your founder page"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "Your avatar"}
                      width={32}
                      height={32}
                      className="block"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center bg-forest font-mono text-xs text-cream">
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
                  className="cursor-pointer font-mono text-xs text-forest/60 underline decoration-2 underline-offset-4 transition-colors hover:text-forest"
                >
                  sign out
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
                className="hover-lift shadow-hard-sm cursor-pointer border-2 border-forest bg-lime px-4 py-1.5 font-mono text-xs font-semibold tracking-wide text-forest uppercase"
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
