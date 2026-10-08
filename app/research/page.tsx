import Container from "@/components/layout/Container";
import { getPublishedArticles } from "@/lib/research/fetch";
import { formatIST } from "@/lib/format/date";
import PageHeader from "@/components/common/PageHeader";
import Link from "next/link";

export const metadata = {
  title: "Research — Stratova Quant",
  description:
    "Systematic research on quantitative investing, portfolio construction, and market structure.",
};

export default async function ResearchPage() {
  const articles = await getPublishedArticles();

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="Research"
          description="Systematic research on quantitative investing, portfolio construction, and market structure."
        />

        <div className="mt-10">
          {articles.length === 0 ? (
            <div className="rounded-md border border-border bg-surface p-10 text-center">
              <p className="text-sm text-secondary">
                No articles published yet.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/research/${article.slug}`}
                className="block border-b border-border px-2 py-8 last:border-0"
              >
                {article.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.cover_image_url}
                    alt=""
                    className="mb-4 aspect-video w-full rounded-t-md object-cover"
                    loading="lazy"
                  />
                ) : null}
                <h3 className="serif text-2xl font-bold text-foreground">
                  {article.title}
                </h3>
                {article.subtitle ? (
                  <p className="mt-2 text-foreground/85">{article.subtitle}</p>
                ) : null}
                {article.category ? (
                  <span className="mt-3 inline-flex items-center rounded-md bg-foreground/5 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-secondary">
                    {article.category}
                  </span>
                ) : null}
                <p className="mt-4 text-xs text-secondary">
                  {formatIST(article.published_at)}
                </p>
              </Link>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}
