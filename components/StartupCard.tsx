import Image from "next/image";
import Link from "next/link";

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
      className="reveal shadow-hard hover-lift flex h-full flex-col border-2 border-forest bg-card"
      style={{ "--stagger": stagger } as React.CSSProperties}
    >
      <Link href={`/startup/${_id}`} className="relative block border-b-2 border-forest">
        <div className="aspect-[16/9] overflow-hidden bg-forest/10">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title ?? "Startup cover"}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <span className="font-display absolute top-0 left-0 border-r-2 border-b-2 border-forest bg-cream px-2.5 py-1 text-sm text-forest">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {lookingFor && lookingFor.length > 0 && (
          <span className="absolute right-0 bottom-0 border-t-2 border-l-2 border-forest bg-lime px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-forest uppercase">
            ✚ team-up
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-center gap-x-3 font-mono text-[11px] text-forest/50">
          <time dateTime={_createdAt}>{formatDate(_createdAt)}</time>
          <span>{views ?? 0} views</span>
          <span className="font-semibold text-meadow">▲ {upvotes ?? 0}</span>
        </p>

        <Link href={`/startup/${_id}`} className="mt-2">
          <h3 className="font-display text-2xl leading-tight tracking-wide text-forest uppercase">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-forest/70">
            {description}
          </p>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Link
            href={`/founder/${author?._id}`}
            className="group flex min-w-0 items-center gap-2"
          >
            {author?.image ? (
              <Image
                src={author.image}
                alt={author?.name ?? "Founder"}
                width={26}
                height={26}
                className="border-2 border-forest"
              />
            ) : (
              <span className="flex size-[26px] items-center justify-center border-2 border-forest bg-forest font-mono text-[10px] text-cream">
                {(author?.name ?? "?").charAt(0)}
              </span>
            )}
            <span className="truncate font-mono text-xs text-forest/70 underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-lime">
              {author?.name}
            </span>
          </Link>

          {category && (
            <Link
              href={`/?category=${encodeURIComponent(category)}`}
              className="shrink-0 -rotate-2 border-2 border-forest bg-cream px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-forest uppercase transition-transform hover:rotate-0"
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
