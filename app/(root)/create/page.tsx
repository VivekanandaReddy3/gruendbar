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
        className="reveal mb-3 font-mono text-[11px] tracking-[0.2em] text-slate-400 uppercase"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        New pitch
      </p>
      <h1
        className="reveal text-4xl font-bold tracking-tight text-ink"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        Start a <span className="mark">pitch.</span>
      </h1>
      <p
        className="reveal mt-3 text-lg text-slate-600"
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        One idea, one page, one team.
      </p>

      {session ? (
        <div
          className="reveal mt-10"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          <PitchForm />
        </div>
      ) : (
        <div
          className="reveal mt-10 rounded-2xl border border-dashed border-emerald-950/15 px-6 py-14 text-center"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          <p className="text-lg font-medium text-ink">
            Pitching needs a founder behind it
          </p>
          <p className="mt-1 text-sm text-slate-500">
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
              className="cursor-pointer rounded-lg bg-ink px-6 py-2.5 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover"
            >
              Sign in with GitHub
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
