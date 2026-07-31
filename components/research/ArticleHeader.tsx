import type { ArticleContent } from "@/lib/article-content";
import { typography } from "@/lib/typography";

type ArticleHeaderProps = {
  article: ArticleContent;
};

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header>
      <div className="flex items-center gap-2 text-sm text-secondary">
        <span>{article.category}</span>
        <span aria-hidden="true" className="text-border">/</span>
        <span>{article.date}</span>
        <span aria-hidden="true" className="text-border">/</span>
        <span>{article.readingTime}</span>
      </div>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
        {article.title}
      </h1>
      <hr className="mt-8 border-t border-border" />
      <p className={`${typography.body} mt-8 text-secondary`}>
        {article.abstract}
      </p>
      <hr className="mt-8 border-t border-border" />
    </header>
  );
}