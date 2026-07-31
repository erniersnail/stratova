import Link from "next/link";
import type { ArticleContent } from "@/lib/article-content";

type ArticleSidebarProps = {
  article: ArticleContent;
};

export default function ArticleSidebar({ article }: ArticleSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="space-y-5">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-tertiary">
            Category
          </h3>
          <p className="mt-1 text-sm text-foreground">{article.category}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-tertiary">
            Published
          </h3>
          <p className="mt-1 text-sm text-foreground">{article.date}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-tertiary">
            Reading Time
          </h3>
          <p className="mt-1 text-sm text-foreground">
            {article.readingTime}
          </p>
        </div>
      </div>

      <hr className="my-6 border-t border-border" />

      <div className="space-y-3">
        <span className="block text-sm text-secondary transition-colors duration-150 hover:text-foreground cursor-pointer">
          Share
        </span>
        <span className="block text-sm text-secondary transition-colors duration-150 hover:text-foreground cursor-pointer">
          Download PDF
        </span>
      </div>

      <hr className="my-6 border-t border-border" />

      <Link
        href="/research"
        className="text-sm text-secondary transition-colors duration-150 hover:text-foreground"
      >
        &larr; Back to Research
      </Link>
    </aside>
  );
}