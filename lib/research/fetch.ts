import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

/** Shape of a single research article row. */
export type ResearchArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body_md: string;
  category: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  /** Admin-chosen publish date (YYYY-MM-DD) while draft. Null = auto. */
  publish_date_override: string | null;
  created_at: string;
  updated_at: string;
};

/** Listing shape (same as article minus the body; inherits publish_date_override). */
export type ResearchListItem = Omit<ResearchArticle, "body_md">;

/** Published articles, newest first (public read). */
export async function getPublishedArticles(): Promise<ResearchListItem[]> {
  const publicClient = createPublicClient();
  const { data } = await publicClient
    .from("research_articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data ?? []).map((row: ResearchArticle) => {
    const { body_md: _omitBody, ...rest } = row;
    void _omitBody;
    return rest as Omit<ResearchArticle, "body_md">;
  });
}
export async function getArticleBySlug(
  slug: string,
): Promise<ResearchArticle | null> {
  const publicClient = createPublicClient();
  const { data } = await publicClient
    .from("research_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data ?? null;
}

/** All articles, newest updated first (admin session client). */
export async function getAdminArticles(): Promise<ResearchListItem[]> {
  const adminClient = await createClient();
  const { data } = await adminClient
    .from("research_articles")
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false });
  return (data ?? []).map((row: ResearchArticle) => {
    const { body_md: _omitBody, ...rest } = row;
    void _omitBody;
    return rest as Omit<ResearchArticle, "body_md">;
  });
}
export async function getAdminArticleById(
  id: string,
): Promise<ResearchArticle | null> {
  const adminClient = await createClient();
  const { data } = await adminClient
    .from("research_articles")
    .select("*")
    .eq("id", id)
    .single();
  return data ?? null;
}
