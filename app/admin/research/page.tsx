import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminArticles } from "@/lib/research/fetch";
import {
  publishArticleAction,
  unpublishArticleAction,
  deleteArticleAction,
} from "@/lib/research/actions";
import ConfirmActionForm from "@/components/admin/ConfirmActionForm";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { formatIST } from "@/lib/format/date";

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

export default async function AdminResearchPage() {
  await requireAdminInPage();
  const articles = await getAdminArticles();

  return (
    <Container className="py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Research — Admin</h1>
        <Button href="/admin/research/new" size="sm">
          New article
        </Button>
      </div>

      {articles.length === 0 ? (
        <p className="border border-border bg-surface px-6 py-10 text-center text-sm text-secondary">
          No articles yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-secondary">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Updated</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-border align-top"
                >
                  <td className="py-3 pr-4 font-medium">{article.title}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-medium ${
                        article.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {article.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-secondary">
                    {article.category ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-secondary">
                    {formatIST(article.updated_at)}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <Link
                        href={`/admin/research/${article.id}`}
                        className="underline hover:text-foreground"
                      >
                        Edit
                      </Link>
                      {article.is_published ? (
                        <form
                          action={unpublishArticleAction.bind(null, article.id)}
                        >
                          <button
                            type="submit"
                            className="underline hover:text-foreground"
                          >
                            Unpublish
                          </button>
                        </form>
                      ) : (
                        <form
                          action={publishArticleAction.bind(null, article.id)}
                        >
                          <button
                            type="submit"
                            className="underline hover:text-foreground"
                          >
                            Publish
                          </button>
                        </form>
                      )}
                      <ConfirmActionForm
                        action={deleteArticleAction}
                        id={article.id}
                        confirmMessage={`Delete "${article.title}"? This cannot be undone.`}
                        className="text-red-600 underline hover:text-red-700"
                      >
                        Delete
                      </ConfirmActionForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}