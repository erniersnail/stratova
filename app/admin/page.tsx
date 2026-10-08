import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { formatIST } from "@/lib/format/date";
import {
  getAdminArticleList,
  removeArticle,
  togglePublished,
} from "@/lib/research/admin";
import type { ReactElement } from "react";

function getStatusBadge(
  status: "draft" | "published",
): ReactElement {
  const label = status === "published" ? "Published" : "Draft";
  const className =
    status === "published"
      ? "bg-foreground/10 text-foreground"
      : "bg-foreground/5 text-secondary";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export default async function AdminPage() {
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
  if (profile?.role !== "admin") redirect("/");

  const articles = await getAdminArticleList();

  return (
    <main>
      <Container className="py-20">
        <div className="flex flex-col gap-4">
          <h1 className="serif text-3xl font-bold text-foreground">
            Admin
          </h1>
          <p className="text-secondary">
            Manage research articles. Only accounts with the <code>admin</code>
            profile role can access this page.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/admin/article/new" variant="primary" size="sm">
              + New article
            </Button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="mt-10 rounded-md border border-border bg-surface p-10 text-center">
            <p className="text-sm text-secondary">No articles yet.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-left font-medium text-secondary px-4 py-3">
                    Title
                  </th>
                  <th className="text-left font-medium text-secondary px-4 py-3">
                    Category
                  </th>
                  <th className="text-left font-medium text-secondary px-4 py-3">
                    Status
                  </th>
                  <th className="text-left font-medium text-secondary px-4 py-3">
                    Updated
                  </th>
                  <th className="text-right font-medium text-secondary px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-border border-b last:border-0 transition-colors hover:bg-foreground/5"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {article.title}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {article.category ?? "—"}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(article.status)}</td>
                    <td className="px-4 py-3 text-secondary">
                      {formatIST(article.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          href={`/admin/article/${article.id}/edit`}
                          variant="secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <form action={togglePublished}>
                          <input type="hidden" name="id" value={article.id} />
                          <input
                            type="hidden"
                            name="is_published"
                            value={article.is_published ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 bg-foreground text-white hover:bg-foreground-hover border border-transparent shadow-sm hover:shadow-md h-9 px-5 text-xs tracking-wide"
                          >
                            {article.is_published
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                        </form>
                        <form action={removeArticle}>
                          <input type="hidden" name="id" value={article.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md h-9 px-5 text-xs tracking-wide"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </main>
  );
}