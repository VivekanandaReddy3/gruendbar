import Image from "next/image";
import Link from "next/link";
import { ArrowBigUp, Eye, Users } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { StartupItem } from "@/lib/types";

const StartupCard = ({
  post,
  index = 0,
  stagger = 0,
}: {
  post: StartupItem;
  index?: number;
  stagger?: number;
}) => {
  const {
    _id,
    _createdAt,
    title,
    description,
    category,
    image,
    views,
    upvotes,
    lookingFor,
    author,
  } = post;

  return (
    <li
      className="reveal group flex h-full flex-col rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ "--stagger": stagger } as React.CSSProperties}
    >
      <Link
        href={`/startup/${_id}`}
        className="relative block aspect-[16/9] overflow-hidden rounded-lg bg-emerald-50"
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title ?? "Startup cover"}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-900 backdrop-blur-sm">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {lookingFor && lookingFor.length > 0 && (
          <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-emerald-700/95 px-2.5 py-1 font-mono text-[10px] tracking-wide text-white">
            <Users className="size-3" />
            team-up
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5">
        <p className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <time dateTime={_createdAt}>{formatDate(_createdAt)}</time>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {views ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <ArrowBigUp className="size-3.5" />
            {upvotes ?? 0}
          </span>
        </p>

        <Link href={`/startup/${_id}`} className="mt-2">
          <h3 className="text-lg leading-snug font-bold tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between pt-4">
          <Link
            href={`/founder/${author?._id}`}
            className="flex min-w-0 items-center gap-2"
          >
            {author?.image ? (
              <Image
                src={author.image}
                alt={author?.name ?? "Founder"}
                width={24}
                height={24}
                className="rounded-full border border-emerald-950/10"
              />
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 font-mono text-[10px] text-emerald-900">
                {(author?.name ?? "?").charAt(0)}
              </span>
            )}
            <span className="link-underline truncate text-xs font-medium text-slate-600">
              {author?.name}
            </span>
          </Link>

          {category && (
            <Link
              href={`/?category=${encodeURIComponent(category)}`}
              className="rounded-full border border-emerald-950/10 px-2.5 py-0.5 font-mono text-[10px] text-slate-500 transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              {category}
            </Link>
          )}
        </div>
      </div>
    </li>
  );
};

export default StartupCard;
