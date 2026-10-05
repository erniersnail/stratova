export type ArticleBlock =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "pull-quote"; content: string; attribution?: string }
  | { type: "code"; content: string; language?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "figure"; caption: string }
  | { type: "math"; content: string };

export type ArticleContent = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  abstract: string;
  blocks: ArticleBlock[];
};

/**
 * Article content store.
 *
 * This record is empty because no research articles have been published yet.
 * When an article is ready for publication, add it here keyed by its slug.
 * The article page will automatically render the content using ArticleContent
 * blocks defined by the ArticleBlock type above.
 */
export const ARTICLE_CONTENT: Record<string, ArticleContent> = {};

export function getArticleContent(slug: string): ArticleContent | undefined {
  return ARTICLE_CONTENT[slug];
}