"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import markdownit from "markdown-it";
import { clsx } from "clsx";

import { createPitch, type CreatePitchState } from "@/lib/actions";
import { CATEGORIES, LOOKING_FOR_ROLES } from "@/lib/constants";

const md = markdownit();

const initialState: CreatePitchState = { status: "IDLE", errors: {} };

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500";
const inputClass =
  "mt-2 w-full rounded-xl border border-emerald-950/15 bg-white px-4 py-2.5 text-sm shadow-card outline-none transition-shadow placeholder:text-slate-400 focus:shadow-card-hover";
const errorClass = "mt-1.5 font-mono text-[11px] text-red-600";

const PitchForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createPitch,
    initialState
  );

  const [pitch, setPitch] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");

  const preview = useMemo(
    () => (tab === "preview" ? md.render(pitch || "*nothing yet…*") : ""),
    [tab, pitch]
  );

  useEffect(() => {
    if (state.status === "SUCCESS" && state.id) {
      router.push(`/startup/${state.id}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={80}
          placeholder="What's it called?"
          className={inputClass}
        />
        {state.errors.title && (
          <p className={errorClass}>{state.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Tagline
        </label>
        <input
          id="description"
          name="description"
          required
          maxLength={200}
          placeholder="One sentence — what does it do, for whom?"
          className={inputClass}
        />
        {state.errors.description && (
          <p className={errorClass}>{state.errors.description}</p>
        )}
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className={clsx(inputClass, "cursor-pointer")}
          >
            <option value="" disabled>
              Pick one…
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {state.errors.category && (
            <p className={errorClass}>{state.errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>
            Cover image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            placeholder="https://…"
            className={inputClass}
          />
          {state.errors.image && (
            <p className={errorClass}>{state.errors.image}</p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Looking for teammates?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {LOOKING_FOR_ROLES.map((role) => (
            <label
              key={role}
              className="group cursor-pointer rounded-full border border-emerald-950/15 px-3.5 py-1.5 font-mono text-[11px] text-slate-600 transition-colors select-none hover:border-emerald-600 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-600 has-[:checked]:text-white"
            >
              <input
                type="checkbox"
                name="lookingFor"
                value={role}
                className="sr-only"
              />
              + {role}
            </label>
          ))}
        </div>
        <p className="mt-2 font-serif text-sm text-slate-400 italic">
          optional — pitches looking for teammates get a badge and a filter.
        </p>
      </fieldset>

      <div>
        <div className="flex items-end justify-between">
          <label htmlFor="pitch" className={labelClass}>
            The pitch
          </label>
          <div className="flex gap-1 font-mono text-[11px]">
            {(["write", "preview"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTab(mode)}
                className={clsx(
                  "cursor-pointer rounded-full px-3 py-1 transition-colors",
                  tab === mode
                    ? "bg-ink text-paper"
                    : "text-slate-400 hover:text-slate-700"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            id="pitch"
            name="pitch"
            required
            rows={12}
            value={pitch}
            onChange={(event) => setPitch(event.target.value)}
            placeholder={
              "Markdown supported.\n\n## The problem\n\n## The idea\n\n## Why now"
            }
            className={clsx(inputClass, "resize-y font-mono text-[13px]")}
          />
        ) : (
          <>
            <input type="hidden" name="pitch" value={pitch} />
            <div
              className="prose prose-slate mt-2 min-h-[19rem] max-w-none rounded-xl border border-emerald-950/15 bg-white px-5 py-4 shadow-card prose-headings:font-semibold"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </>
        )}
        {state.errors.pitch && (
          <p className={errorClass}>{state.errors.pitch}</p>
        )}
      </div>

      {state.errors.form && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {state.errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-full bg-ink px-8 py-3 font-mono text-xs text-paper transition-all duration-300 hover:bg-emerald-900 hover:shadow-card-hover disabled:opacity-60"
      >
        {isPending ? "Publishing…" : "Publish pitch →"}
      </button>
    </form>
  );
};

export default PitchForm;
