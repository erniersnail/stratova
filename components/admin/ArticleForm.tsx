"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createArticleAction,
  updateArticleAction,
  type ArticleFormState,
} from "@/lib/research/actions";
import type { ResearchArticle } from "@/lib/research/fetch";
import Button from "@/components/ui/Button";

type ArticleFormProps =
  | { mode: "new" }
  | { mode: "edit"; article: ResearchArticle };

const INPUT =
  "w-full rounded-sm border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-tertiary transition-colors duration-200 focus:border-foreground focus:outline-none";

const LABEL = "mb-1.5 block text-sm font-medium text-foreground";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Current date (or ISO instant) as YYYY-MM-DD in IST. */
function datePartIST(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function ArticleForm(props: ArticleFormProps) {
  const isEdit = props.mode === "edit";
  const article = isEdit ? props.article : null;

  const action = isEdit ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState<
    ArticleFormState,
    FormData
  >(action, {});

  // Server-returned fields win over article props so a failed submit shows
  // what the user just typed. Uncontrolled + key remount keeps defaultValue
  // fresh without setState-in-effect (same pattern as ContactForm).
  const saved = state.fields;
  const formKey = [
    props.mode,
    article?.id ?? "",
    state.fields ? JSON.stringify(state.fields) : "initial",
  ].join("|");

  // Fix 3: auto (now on publish) vs manual (backdated) publish date.
  // Controlled radios only; the date input stays uncontrolled.
  const [dateMode, setDateMode] = useState<"auto" | "manual">(
    article?.publish_date_override ? "manual" : "auto",
  );

  const defaultPublishDate =
    saved?.publish_date ||
    article?.publish_date_override ||
    (article?.published_at
      ? datePartIST(article.published_at)
      : datePartIST(new Date()));

  return (
    <form key={formKey} action={formAction} className="space-y-5">
      {props.mode === "edit" ? (
        <input type="hidden" name="id" value={props.article.id} />
      ) : null}

      <div>
        <label htmlFor="slug" className={LABEL}>
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={saved?.slug ?? article?.slug ?? ""}
          placeholder="lowercase-with-hyphens"
          className={`${INPUT} font-mono`}
          onChange={(event) => {
            // Lowercase + sanitize live so typing never fails validation.
            event.target.value = event.target.value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
          }}
        />
        <p className="mt-1.5 text-xs text-secondary">lowercase-with-hyphens</p>
      </div>

      <div>
        <label htmlFor="title" className={LABEL}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={saved?.title ?? article?.title ?? ""}
          className={INPUT}
          onBlur={(event) => {
            const slugInput = document.getElementById("slug");
            if (
              slugInput instanceof HTMLInputElement &&
              !slugInput.value.trim()
            ) {
              slugInput.value = slugify(event.currentTarget.value);
            }
          }}
        />
      </div>

      <div>
        <label htmlFor="subtitle" className={LABEL}>
          Subtitle{" "}
          <span className="font-normal text-secondary">(optional)</span>
        </label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          defaultValue={saved?.subtitle ?? article?.subtitle ?? ""}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="category" className={LABEL}>
          Category{" "}
          <span className="font-normal text-secondary">(optional)</span>
        </label>
        <input
          id="category"
          name="category"
          type="text"
          defaultValue={saved?.category ?? article?.category ?? ""}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="body_md" className={LABEL}>
          Body (markdown)
        </label>
        <textarea
          id="body_md"
          name="body_md"
          required
          defaultValue={saved?.body_md ?? article?.body_md ?? ""}
          rows={16}
          className={`${INPUT} min-h-[400px] font-mono leading-relaxed`}
        />
      </div>

      <fieldset className="border-t border-border pt-4">
        <legend className="sr-only">Publish date</legend>
        <p className="mb-2 text-sm font-medium text-foreground">
          Publish date
        </p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="publish_date_mode"
              value="auto"
              checked={dateMode === "auto"}
              onChange={() => setDateMode("auto")}
              className="h-4 w-4 accent-foreground"
            />
            Use current date when published
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="publish_date_mode"
              value="manual"
              checked={dateMode === "manual"}
              onChange={() => setDateMode("manual")}
              className="h-4 w-4 accent-foreground"
            />
            Set a specific date
          </label>
          {dateMode === "manual" ? (
            <input
              type="date"
              name="publish_date"
              required
              defaultValue={defaultPublishDate}
              className={`${INPUT} max-w-[220px]`}
            />
          ) : null}
        </div>
        <p className="mt-2 text-xs text-secondary">
          Manual dates backdate the article: publishing sets{" "}
          <code className="font-mono">published_at</code> to midnight IST on
          that date.
        </p>
      </fieldset>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-green-700">{state.success}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create draft"}
        </Button>
        <Link
          href="/admin/research"
          className="text-sm text-secondary underline hover:text-foreground"
        >
          Back to list
        </Link>
      </div>
    </form>
  );
}