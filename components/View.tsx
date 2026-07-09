import { after } from "next/server";
import { Eye } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { incrementViews } from "@/lib/actions";

/**
 * Shows the live view count and — after the response has been sent —
 * increments it, so counting never blocks rendering.
 */
const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });
  const totalViews = result?.views ?? 0;

  after(async () => {
    await incrementViews(id);
  });

  return (
    <span className="flex items-center gap-1">
      <Eye className="size-3.5" />
      {totalViews} {totalViews === 1 ? "view" : "views"}
    </span>
  );
};

export default View;
