import type { Metadata } from "next";

import { safeAuth, signIn } from "@/auth";
import PitchForm from "@/components/PitchForm";

export const metadata: Metadata = {
  title: "Start a pitch",
};

export default async function CreatePage() {
  const session = await safeAuth();

  return (
    <section className="container-narrow">
      <p
        className="reveal font-mono text-[11px] font-semibold tracking-[0.25em] text-meadow uppercase"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        New entry
      </p>
      <h1
        className="reveal font-display mt-3 text-5xl leading-[0.95] tracking-wide text-forest uppercase md:text-6xl"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        File your{" "}
        <span className="inline-block bg-lime px-2">pitch.</span>
      </h1>
      <p
        className="reveal mt-4 text-forest/70"
        style={{ "--stagger": 2 } as React.CSSProperties}
      >
        One idea, one page, one team.
      </p>

      {session ? (
        <div
          className="reveal mt-10"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <PitchForm />
        </div>
      ) : (
        <div
          className="reveal shadow-hard mt-10 border-2 border-forest bg-card px-6 py-14 text-center"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <p className="font-display text-2xl text-forest uppercase">
            Pitching needs a founder behind it
          </p>
          <p className="mt-2 font-mono text-xs text-forest/60">
            Sign in with GitHub — your profile becomes your founder page.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/create" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="hover-lift shadow-hard cursor-pointer border-2 border-forest bg-lime px-6 py-2.5 font-mono text-xs font-semibold tracking-wide text-forest uppercase"
            >
              Sign in with GitHub
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
