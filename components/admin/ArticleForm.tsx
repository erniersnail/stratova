"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import {
  createArticleAction,
  updateArticleAction,
  type ArticleFormState,
} from "@/lib/research/actions";
import type { ResearchArticle } from "@/lib/research/fetch";
import { uploadArticleMedia } from "@/lib/research/upload";
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

  // Cover image: uploaded client-side BEFORE submit; hidden input carries
  // the URL. Lives here (not in the keyed form) so it survives error remounts.
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? "");
  const [coverName, setCoverName] = useState("");
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Inline image: insert markdown at the caret of the uncontrolled textarea.
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  async function handleCoverSelect(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverError(null);
    setCoverUploading(true);
    const result = await uploadArticleMedia(file);
    setCoverUploading(false);
    if ("error" in result) {
      setCoverError(result.error);
      return;
    }
    setCoverUrl(result.url);
    setCoverName(file.name);
  }

  function handleCoverRemove(): void {
    setCoverUrl("");
    setCoverName("");
    setCoverError(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function insertAtCursor(url: string): void {
    const textarea = bodyRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;
    const insertion = `![image](${url})\n`;
    textarea.value =
      textarea.value.slice(0, start) + insertion + textarea.value.slice(end);
    const caret = start + insertion.length;
    textarea.focus();
    textarea.setSelectionRange(caret, caret);
  }

  async function handleInlineImageSelect(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (file) {
      setImageError(null);
      setImageUploading(true);
      const result = await uploadArticleMedia(file);
      setImageUploading(false);
      if ("error" in result) {
        setImageError(result.error);
        return; // body untouched on error
      }
      insertAtCursor(result.url);
    }
    // Allow re-picking the same file later.
    event.target.value = "";
  }

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
        <div className="mb-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleInlineImageSelect}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={imageUploading}
            onClick={() => imageInputRef.current?.click()}
          >
            {imageUploading ? "Uploading…" : "Insert image"}
          </Button>
          {imageError ? (
            <p className="mt-2 text-xs text-red-600">{imageError}</p>
          ) : null}
        </div>
        <textarea
          id="body_md"
          name="body_md"
          ref={bodyRef}
          required
          defaultValue={saved?.body_md ?? article?.body_md ?? ""}
          rows={16}
          className={`${INPUT} min-h-[400px] font-mono leading-relaxed`}
        />
      </div>

      <div className="border-t border-border pt-4">
        <p className={LABEL}>
          Cover image <span className="font-normal text-secondary">(optional)</span>
        </p>
        <input type="hidden" name="cover_image_url" value={coverUrl} />
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block text-sm text-secondary file:mr-3 file:cursor-pointer file:rounded-sm file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground file:transition-colors file:hover:border-foreground"
            onChange={handleCoverSelect}
          />
          {coverName ? (
            <span className="max-w-[240px] truncate text-xs text-secondary">
              {coverName}
            </span>
          ) : null}
          {coverUrl ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCoverRemove}
            >
              Remove
            </Button>
          ) : null}
        </div>
        {coverUploading ? (
          <p className="mt-2 text-xs text-secondary">Uploading…</p>
        ) : null}
        {coverError ? (
          <p className="mt-2 text-xs text-red-600">{coverError}</p>
        ) : null}
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt="Cover preview"
            className="mt-3 h-32 w-auto rounded-md border border-border object-cover"
          />
        ) : null}
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