"use client";

import { useState } from "react";
import type { ArticleInput } from "@/lib/research/admin";

type Props = {
  initial?: ArticleInput;
  id?: string;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitLabel: string;
};

const INPUT =
  "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent";

const LABEL = "mb-1.5 block text-xs font-medium tracking-wide text-secondary";

const EMPTY: ArticleInput = {
  slug: "",
  title: "",
  subtitle: "",
  body_md: "",
  category: "",
  author_name: "",
  is_published: false,
  published_at: "",
};

function toDatetimeLocalValue(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function ArticleForm({ initial, id, action, submitLabel }: Props) {
  const [values, setValues] = useState<ArticleInput>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof ArticleInput, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const formData = new FormData();
    if (id) formData.append("id", id);
    formData.append("slug", values.slug.trim());
    formData.append("title", values.title.trim());
    formData.append("subtitle", values.subtitle.trim());
    formData.append("body_md", values.body_md);
    formData.append("category", values.category.trim());
    formData.append("author_name", values.author_name.trim());
    formData.append("is_published", values.is_published ? "true" : "false");
    formData.append("published_at", values.published_at.trim());

    const result = await action(formData);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
    if (!id) setValues(EMPTY);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {error ? (
        <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className="mb-5 rounded-sm border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">
          Saved.
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Slug</label>
            <input
              type="text"
              name="slug"
              value={values.slug}
              disabled={Boolean(id)}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="e.g. factor-ladder"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <input
              type="text"
              name="category"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Factor investing"
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Title</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Short working title"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={values.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="One-line summary (optional)"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Author</label>
          <input
            type="text"
            name="author_name"
            value={values.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            placeholder="Stratova Quant"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Body (markdown)</label>
          <textarea
            name="body_md"
            value={values.body_md}
            onChange={(e) => set("body_md", e.target.value)}
            rows={14}
            placeholder={"# Heading\n\nParagraph text. Use **markdown**."}
            className={INPUT}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Published</label>
            <input
              type="checkbox"
              name="is_published"
              checked={values.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-border text-foreground focus:ring-foreground"
            />
          </div>
          <div>
            <label className={LABEL}>Publish at (optional)</label>
            <input
              type="datetime-local"
              name="published_at"
              value={toDatetimeLocalValue(values.published_at)}
              onChange={(e) => set("published_at", e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-transparent bg-foreground px-6 text-sm font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-foreground-hover hover:shadow-md"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
