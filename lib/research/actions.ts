"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormState = {
  error?: string;
  success?: string;
  fields?: {
    slug?: string;
    title?: string;
    subtitle?: string;
    body_md?: string;
    category?: string;
    publish_date?: string;
  };
};

/** Lowercase alphanumeric segments joined by single hyphens. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ArticleFields = {
  slug: string;
  title: string;
  subtitle: string;
  body_md: string;
  category: string;
};

/**
 * Throws unless the caller is signed in with profiles.role = 'admin'.
 * Messages stay generic — RLS is the real enforcement layer.
 */
async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Admin access required.");
}

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function toNullable(value: string): string | null {
  return value === "" ? null : value;
}

function readFields(formData: FormData): ArticleFields {
  return {
    slug: readString(formData, "slug"),
    title: readString(formData, "title"),
    subtitle: readString(formData, "subtitle"),
    body_md: readString(formData, "body_md"),
    category: readString(formData, "category"),
  };
}

function validate(
  fields: ArticleFields,
): { ok: true } | { ok: false; error: string } {
  if (!fields.title) return { ok: false, error: "Title is required." };
  if (!fields.body_md) return { ok: false, error: "Body is required." };
  if (!SLUG_RE.test(fields.slug)) {
    return {
      ok: false,
      error: "Slug must be lowercase letters, numbers, and hyphens.",
    };
  }
  return { ok: true };
}

function revalidateResearch(): void {
  revalidatePath("/research");
  revalidatePath("/research/[slug]", "page");
  revalidatePath("/admin/research");
}

const PUBLISH_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Valid "YYYY-MM-DD" → that instant at 00:00 IST, as an ISO timestamptz. */
function istMidnightIso(date: string): string {
  return `${date}T00:00:00+05:30`;
}

/**
 * Reads publish_date_mode / publish_date from the form.
 * "auto" (or absent) → null. "manual" → a validated YYYY-MM-DD, or
 * ok: false when the date is missing/malformed (client type=date +
 * required normally prevents this).
 */
function parsePublishDate(
  formData: FormData,
): { ok: true; date: string | null } | { ok: false } {
  if (readString(formData, "publish_date_mode") !== "manual") {
    return { ok: true, date: null };
  }
  const date = readString(formData, "publish_date");
  if (!PUBLISH_DATE_RE.test(date)) return { ok: false };
  if (Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) return { ok: false };
  return { ok: true, date };
}

/** Unique-violation (Postgres 23505) from the slug unique index. */
function isDuplicateSlug(code: string | undefined, message: string): boolean {
  return code === "23505" || message.includes("duplicate key");
}

export async function createArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const fields = {
    ...readFields(formData),
    publish_date: readString(formData, "publish_date"),
  };
  const publishDate = parsePublishDate(formData);
  let newId = "";

  try {
    await requireAdmin();

    const parsed = validate(fields);
    if (!parsed.ok) return { error: parsed.error, fields };
    if (!publishDate.ok) {
      return { error: "Please pick a valid publish date.", fields };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("research_articles")
      .insert({
        slug: fields.slug,
        title: fields.title,
        body_md: fields.body_md,
        subtitle: toNullable(fields.subtitle),
        category: toNullable(fields.category),
        author_name: readString(formData, "author_name") || "Stratova Quant",
        is_published: false,
        published_at: null,
        publish_date_override: publishDate.date,
      })
      .select("id")
      .single();

    if (error || !data) {
      if (error && isDuplicateSlug(error.code, error.message)) {
        return { error: "That slug is already in use.", fields };
      }
      return {
        error: "Could not save the article. Please try again.",
        fields,
      };
    }
    newId = data.id;
  } catch {
    return { error: "Could not save the article. Please try again.", fields };
  }

  revalidateResearch();
  redirect(`/admin/research/${newId}`);
}

export async function updateArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const fields = {
    ...readFields(formData),
    publish_date: readString(formData, "publish_date"),
  };
  const publishDate = parsePublishDate(formData);

  try {
    await requireAdmin();

    const id = readString(formData, "id");
    if (!id) {
      return {
        error: "Could not save the article. Please try again.",
        fields,
      };
    }

    const parsed = validate(fields);
    if (!parsed.ok) return { error: parsed.error, fields };
    if (!publishDate.ok) {
      return { error: "Please pick a valid publish date.", fields };
    }

    // is_published is intentionally untouched — publishing has its own
    // action. publish_date_override is always rewritten (auto → null).
    const supabase = await createClient();

    const updatePayload: Record<string, unknown> = {
      slug: fields.slug,
      title: fields.title,
      subtitle: toNullable(fields.subtitle),
      body_md: fields.body_md,
      category: toNullable(fields.category),
      publish_date_override: publishDate.date,
    };

    // Rule 4: editing an already-published article with a manual date also
    // moves published_at, so the displayed date updates immediately.
    const { data: current } = await supabase
      .from("research_articles")
      .select("is_published")
      .eq("id", id)
      .maybeSingle();
    if (current?.is_published && publishDate.date) {
      updatePayload.published_at = istMidnightIso(publishDate.date);
    }

    const { error } = await supabase
      .from("research_articles")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      if (isDuplicateSlug(error.code, error.message)) {
        return { error: "That slug is already in use.", fields };
      }
      return { error: "Could not save the article. Please try again.", fields };
    }
  } catch {
    return { error: "Could not save the article. Please try again.", fields };
  }

  revalidateResearch();
  return { success: "Saved." };
}

export async function publishArticleAction(id: string): Promise<void> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { data: row } = await supabase
      .from("research_articles")
      .select("published_at, publish_date_override")
      .eq("id", id)
      .maybeSingle();

    // Manual override → that date at 00:00 IST; auto → existing published_at
    // (republish case) or now().
    const publishedAt = row?.publish_date_override
      ? istMidnightIso(row.publish_date_override)
      : (row?.published_at ?? new Date().toISOString());

    const { error } = await supabase
      .from("research_articles")
      .update({
        is_published: true,
        published_at: publishedAt,
      })
      .eq("id", id);
    if (error) throw error;

    revalidateResearch();
  } catch {
    throw new Error("Failed to publish the article.");
  }
  redirect("/admin/research");
}

export async function unpublishArticleAction(id: string): Promise<void> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .update({ is_published: false, published_at: null })
      .eq("id", id);
    if (error) throw error;

    revalidateResearch();
  } catch {
    throw new Error("Failed to unpublish the article.");
  }
}

export async function deleteArticleAction(id: string): Promise<void> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .delete()
      .eq("id", id);
    if (error) throw error;

    revalidateResearch();
  } catch {
    throw new Error("Failed to delete the article.");
  }
  redirect("/admin/research");
}
