import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { ARTICLE_CONTENT, getArticleContent } from "@/lib/article-content";
import { RESEARCH_ITEMS } from "@/lib/research";
import ArticleHeader from "@/components/research/ArticleHeader";
import ArticleSidebar from "@/components/research/ArticleSidebar";
import ArticleContent from "@/components/research/ArticleContent";
import RelatedResearch from "@/components/research/RelatedResearch";

export function generateStaticParams() {
  return Object.keys(ARTICLE_CONTENT).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleContent(slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          <article className="max-w-[680px]">
            <ArticleHeader article={article} />
            <div className="mt-10">
              <ArticleContent blocks={article.blocks} />
            </div>
          </article>
          <div className="hidden lg:block">
            <ArticleSidebar article={article} />
          </div>
        </div>

        <div className="lg:hidden">
          <hr className="my-10 border-t border-border" />
          <ArticleSidebar article={article} />
        </div>

        <RelatedResearch
          currentSlug={slug}
          category={article.category}
          items={RESEARCH_ITEMS}
        />
      </Container>
    </main>
  );
}