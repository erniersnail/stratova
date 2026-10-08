"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormState = {
  error?: string;
  success?: string;
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

function validate(
  formData: FormData,
): { ok: true; fields: ArticleFields } | { ok: false; error: string } {
  const fields: ArticleFields = {
    slug: readString(formData, "slug"),
    title: readString(formData, "title"),
    subtitle: readString(formData, "subtitle"),
    body_md: readString(formData, "body_md"),
    category: readString(formData, "category"),
  };

  if (!fields.title) return { ok: false, error: "Title is required." };
  if (!fields.body_md) return { ok: false, error: "Body is required." };
  if (!SLUG_RE.test(fields.slug)) {
    return {
      ok: false,
      error: "Slug must be lowercase letters, numbers, and hyphens.",
    };
  }
  return { ok: true, fields };
}

function revalidateResearch(): void {
  revalidatePath("/research");
  revalidatePath("/research/[slug]", "page");
  revalidatePath("/admin/research");
}

/** Unique-violation (Postgres 23505) from the slug unique index. */
function isDuplicateSlug(code: string | undefined, message: string): boolean {
  return code === "23505" || message.includes("duplicate key");
}

export async function createArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  let newId = "";

  try {
    await requireAdmin();

    const parsed = validate(formData);
    if (!parsed.ok) return { error: parsed.error };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("research_articles")
      .insert({
        ...parsed.fields,
        subtitle: toNullable(parsed.fields.subtitle),
        category: toNullable(parsed.fields.category),
        author_name: readString(formData, "author_name") || "Stratova Quant",
        is_published: false,
        published_at: null,
      })
      .select("id")
      .single();

    if (error || !data) {
      if (error && isDuplicateSlug(error.code, error.message)) {
        return { error: "That slug is already in use." };
      }
      return { error: "Could not save the article. Please try again." };
    }
    newId = data.id;
  } catch {
    return { error: "Could not save the article. Please try again." };
  }

  revalidateResearch();
  redirect(`/admin/research/${newId}`);
}

export async function updateArticleAction(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  try {
    await requireAdmin();

    const id = readString(formData, "id");
    if (!id) return { error: "Could not save the article. Please try again." };

    const parsed = validate(formData);
    if (!parsed.ok) return { error: parsed.error };

    // is_published / published_at are intentionally untouched — publishing
    // has its own action.
    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .update({
        slug: parsed.fields.slug,
        title: parsed.fields.title,
        subtitle: toNullable(parsed.fields.subtitle),
        body_md: parsed.fields.body_md,
        category: toNullable(parsed.fields.category),
      })
      .eq("id", id);

    if (error) {
      if (isDuplicateSlug(error.code, error.message)) {
        return { error: "That slug is already in use." };
      }
      return { error: "Could not save the article. Please try again." };
    }
  } catch {
    return { error: "Could not save the article. Please try again." };
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
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("research_articles")
      .update({
        is_published: true,
        published_at: row?.published_at ?? new Date().toISOString(),
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
