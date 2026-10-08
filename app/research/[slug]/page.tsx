import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/research/fetch";
import { formatIST } from "@/lib/format/date";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

/**
 * Minimal prose-like class map for the markdown body (no plugins, per spec).
 */
const PROSE: Components = {
  h1: (props) => (
    <h1 className="serif text-4xl font-bold leading-tight mt-2" {...props} />
  ),
  h2: (props) => (
    <h2 className="serif text-3xl font-bold leading-tight mt-10" {...props} />
  ),
  h3: (props) => (
    <h3 className="serif text-2xl font-bold leading-tight mt-8" {...props} />
  ),
  p: (props) => <p className="my-4 text-foreground/85" {...props} />,
  a: (props) => <a className="text-foreground underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc space-y-3" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-3" {...props} />,
  li: (props) => <li className="text-foreground/85" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-border pl-4 my-4 text-secondary italic" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm" {...props} />
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="my-8 max-w-full rounded-md border border-border"
      loading="lazy"
    />
  ),
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return {
      title: "Research",
      description:
        "Systematic research on quantitative investing, portfolio construction, and market structure.",
    };
  }
  return {
    title: article.title,
    description: article.subtitle ?? article.body_md.slice(0, 160),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <Container size="reading" className="py-20">
        <Link
          href="/research"
          className="text-sm text-secondary transition-colors hover:text-foreground"
        >
          ← Research
        </Link>

        {article.category ? (
          <span className="mt-4 inline-flex items-center rounded-md bg-foreground/5 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-secondary">
            {article.category}
          </span>
        ) : null}

        <h1 className="serif text-4xl font-bold leading-tight mt-8">
          {article.title}
        </h1>
        {article.subtitle ? (
          <p className="mt-3 text-lg leading-[1.75] text-foreground/85">
            {article.subtitle}
          </p>
        ) : null}

        <p className="mt-6 text-sm text-foreground/70">
          By {article.author_name} · {formatIST(article.published_at)}
        </p>

        {article.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image_url}
            alt=""
            className="my-8 max-w-full rounded-md"
            loading="lazy"
          />
        ) : null}

        <div className="mt-10">
          <ReactMarkdown components={PROSE}>{article.body_md}</ReactMarkdown>
        </div>
      </Container>
    </main>
  );
}