import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import ArticleForm from "@/components/admin/ArticleForm";
import { createClient } from "@/lib/supabase/server";
import { createArticle } from "@/lib/research/admin";

export const metadata = {
  title: "New article — Admin",
};

export default async function NewArticlePage() {
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

  return (
    <main>
      <Container className="py-20">
        <h1 className="serif text-3xl font-bold text-foreground">
          New article
        </h1>
        <div className="mt-8">
          <ArticleForm action={createArticle} submitLabel="Create article" />
        </div>
      </Container>
    </main>
  );
}
