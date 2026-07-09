"use client";

import { useState, useTransition } from "react";
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
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-pressed={hasUpvoted}
        className={clsx(
          "hover-lift shadow-hard flex cursor-pointer items-center gap-2 border-2 border-forest px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide",
          hasUpvoted ? "bg-forest text-lime" : "bg-lime text-forest"
        )}
      >
        <span className={clsx("transition-transform", hasUpvoted && "-translate-y-0.5")}>
          ▲
        </span>
        {upvotes}
        <span className="hidden sm:inline">
          {hasUpvoted ? "upvoted" : "upvote"}
        </span>
      </button>
      {hint && (
        <p className="font-mono text-[10px] text-forest/50">{hint}</p>
      )}
    </div>
  );
};

export default UpvoteButton;
