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
            <ul className="divide-y divide-border border-y border-border">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/research/${a.slug}`}
                    className="group flex gap-6 py-6 transition-colors"
                  >
                    {a.cover_image_url ? (
                      <div className="aspect-video w-[120px] shrink-0 overflow-hidden rounded-md border border-border sm:w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.cover_image_url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                      {a.category ? (
                        <span className="text-xs font-medium uppercase tracking-wider text-tertiary">
                          {a.category}
                        </span>
                      ) : null}
                      <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:underline">
                        {a.title}
                      </h3>
                      {a.subtitle ? (
                        <p className="line-clamp-2 text-sm text-secondary">
                          {a.subtitle}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-tertiary">
                        {formatIST(a.published_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </main>
  );
}
