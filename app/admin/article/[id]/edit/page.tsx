import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import ArticleForm from "@/components/admin/ArticleForm";
import { createClient } from "@/lib/supabase/server";
import { getAdminArticleById, updateArticle, type ArticleInput } from "@/lib/research/admin";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
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

  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) {
    notFound();
  }

  const initial: ArticleInput = {
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle ?? "",
    body_md: article.body_md,
    category: article.category ?? "",
    author_name: article.author_name,
    is_published: article.is_published,
    published_at: article.published_at ?? "",
  };

  return (
    <Container className="py-20">
      <h1 className="serif text-3xl font-bold text-foreground">
        Edit article
      </h1>
      <div className="mt-8">
        <ArticleForm
          action={updateArticle}
          submitLabel="Save changes"
          initial={initial}
          id={article.id}
        />
      </div>
    </Container>
  );
}
