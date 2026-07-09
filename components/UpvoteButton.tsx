"use client";

import { useState, useTransition } from "react";
import { ArrowBigUp } from "lucide-react";
import { clsx } from "clsx";

import { toggleUpvote } from "@/lib/actions";

interface Props {
  startupId: string;
  initialUpvotes: number;
  initialHasUpvoted: boolean;
  signedIn: boolean;
}

const UpvoteButton = ({
  startupId,
  initialUpvotes,
  initialHasUpvoted,
  signedIn,
}: Props) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [hint, setHint] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!signedIn) {
      setHint("Sign in with GitHub to upvote");
      return;
    }

    // Optimistic flip; reconciled with the server result below.
    const optimisticHasUpvoted = !hasUpvoted;
    setHasUpvoted(optimisticHasUpvoted);
    setUpvotes((count) => count + (optimisticHasUpvoted ? 1 : -1));

    startTransition(async () => {
      const result = await toggleUpvote(startupId);
      if (result.error) {
        setHasUpvoted(!optimisticHasUpvoted);
        setUpvotes((count) => count + (optimisticHasUpvoted ? -1 : 1));
        setHint(
          result.error === "SIGN_IN"
            ? "Sign in with GitHub to upvote"
            : "Could not save your vote — try again"
        );
      } else {
        setUpvotes(result.upvotes);
        setHasUpvoted(result.hasUpvoted);
        setHint(null);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-pressed={hasUpvoted}
        className={clsx(
          "flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-300",
          hasUpvoted
            ? "border-emerald-600 bg-emerald-600 text-white shadow-card"
            : "border-emerald-950/15 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-700 hover:shadow-card"
        )}
      >
        <ArrowBigUp
          className={clsx(
            "size-4 transition-transform duration-300",
            hasUpvoted && "-translate-y-0.5 fill-current"
          )}
        />
        {upvotes}
        <span className="hidden sm:inline">
          {hasUpvoted ? "upvoted" : "upvote"}
        </span>
      </button>
      {hint && (
        <p className="font-mono text-[10px] text-slate-400">{hint}</p>
      )}
    </div>
  );
};

export default UpvoteButton;
