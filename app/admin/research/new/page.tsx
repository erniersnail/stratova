import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

export default async function NewArticlePage() {
  await requireAdminInPage();

  return (
    <Container className="py-16">
      <h1 className="mb-8 font-serif text-3xl">New article</h1>
      <ArticleForm mode="new" />
    </Container>
  );
}