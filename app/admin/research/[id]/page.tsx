import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminArticleById } from "@/lib/research/fetch";
import {
  publishArticleAction,
  unpublishArticleAction,
  deleteArticleAction,
} from "@/lib/research/actions";
import ConfirmActionForm from "@/components/admin/ConfirmActionForm";
import Container from "@/components/layout/Container";
import { ArticleForm } from "@/components/admin/ArticleForm";

async function requireAdminInPage(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") notFound();
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminInPage();
  const { id } = await params;
  const article = await getAdminArticleById(id);
  if (!article) notFound();

  return (
    <Container className="py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-medium ${
              article.is_published
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {article.is_published
              ? `Status: Published (on ${formatDate(
                  article.published_at ?? article.created_at,
                )})`
              : "Status: Draft"}
          </span>

          {article.is_published ? (
            <>
              <form action={unpublishArticleAction.bind(null, article.id)}>
                <button
                  type="submit"
                  className="text-xs underline hover:text-foreground"
                >
                  Unpublish
                </button>
              </form>
              <Link
                href={`/research/${article.slug}`}
                className="text-xs underline hover:text-foreground"
              >
                View on site →
              </Link>
            </>
          ) : (
            <form action={publishArticleAction.bind(null, article.id)}>
              <button
                type="submit"
                className="text-xs underline hover:text-foreground"
              >
                Publish
              </button>
            </form>
          )}
        </div>

        <ConfirmActionForm
          action={deleteArticleAction}
          id={article.id}
          confirmMessage={`Delete "${article.title}"? This cannot be undone.`}
          className="text-xs text-red-600 underline hover:text-red-700"
        >
          Delete
        </ConfirmActionForm>
      </div>

      <h1 className="mb-8 font-serif text-3xl">Edit article</h1>
      <ArticleForm mode="edit" article={article} />
    </Container>
  );
}