"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminArticleById as fetchAdminArticleById,
  getAdminArticles,
  type ResearchArticle,
  type ResearchListItem,
} from "./fetch";

export type ResearchArticleStatus = "draft" | "published";

export type AdminArticleRow = ResearchListItem & {
  status: ResearchArticleStatus;
};

/** Form shape shared by the new + edit article forms. */
export type ArticleInput = {
  slug: string;
  title: string;
  subtitle: string;
  body_md: string;
  category: string;
  author_name: string;
  is_published: boolean;
  published_at: string;
};

export async function getAdminArticleList(): Promise<AdminArticleRow[]> {
  const articles = await getAdminArticles();
  return articles.map((article) => ({
    ...article,
    status: article.is_published ? "published" : "draft",
  }));
}

export async function getAdminArticleById(
  id: string,
): Promise<ResearchArticle | null> {
  return fetchAdminArticleById(id);
}

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

function toPublishedAt(isPublished: boolean, raw: string): string | null {
  if (!isPublished) return null;
  if (raw !== "") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function createArticle(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const slug = readString(formData, "slug");
    const title = readString(formData, "title");
    if (!slug) return { success: false, error: "Slug is required." };
    if (!title) return { success: false, error: "Title is required." };

    const subtitle = readString(formData, "subtitle");
    const bodyMd = (formData.get("body_md") as string | null) ?? "";
    if (bodyMd.trim() === "") {
      return { success: false, error: "Body is required." };
    }
    const category = readString(formData, "category");
    const authorName = readString(formData, "author_name");
    const isPublished = formData.get("is_published") === "true";
    const publishedAtRaw = readString(formData, "published_at");

    const supabase = await createClient();
    const { error } = await supabase.from("research_articles").insert({
      slug,
      title,
      subtitle: toNullable(subtitle),
      body_md: bodyMd,
      category: toNullable(category),
      author_name: authorName === "" ? "Stratova Quant" : authorName,
      is_published: isPublished,
      published_at: toPublishedAt(isPublished, publishedAtRaw),
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/research");
    return { success: true };
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
}

export async function updateArticle(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const id = readString(formData, "id");
    if (!id) return { success: false, error: "Missing article id." };

    const title = readString(formData, "title");
    if (!title) return { success: false, error: "Title is required." };

    const subtitle = readString(formData, "subtitle");
    const bodyMd = (formData.get("body_md") as string | null) ?? "";
    if (bodyMd.trim() === "") {
      return { success: false, error: "Body is required." };
    }
    const category = readString(formData, "category");
    const authorName = readString(formData, "author_name");
    const isPublished = formData.get("is_published") === "true";
    const publishedAtRaw = readString(formData, "published_at");

    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .update({
        title,
        subtitle: toNullable(subtitle),
        body_md: bodyMd,
        category: toNullable(category),
        author_name: authorName === "" ? "Stratova Quant" : authorName,
        is_published: isPublished,
        published_at: toPublishedAt(isPublished, publishedAtRaw),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/research");
    return { success: true };
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
}

export async function deleteArticle(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const id = readString(formData, "id");
    if (!id) return { success: false, error: "Missing article id." };

    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/research");
    return { success: true };
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
}

export async function setPublished(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const id = readString(formData, "id");
    if (!id) return { success: false, error: "Missing article id." };
    const isPublished = formData.get("is_published") === "true";

    const supabase = await createClient();
    const { error } = await supabase
      .from("research_articles")
      .update({
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/research");
    return { success: true };
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
}

/** Form-compatible wrappers (React form actions must return void). */
export async function removeArticle(formData: FormData): Promise<void> {
  const result = await deleteArticle(formData);
  if (!result.success) throw new Error(result.error ?? "Delete failed.");
}

export async function togglePublished(formData: FormData): Promise<void> {
  const result = await setPublished(formData);
  if (!result.success) throw new Error(result.error ?? "Update failed.");
}
