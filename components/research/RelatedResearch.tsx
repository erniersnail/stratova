import Link from "next/link";
import type { ResearchItem } from "@/lib/research";
import ResearchCard from "@/components/research/ResearchCard";

type RelatedResearchProps = {
  currentSlug: string;
  category: string;
  items: ResearchItem[];
};

export default function RelatedResearch({
  currentSlug,
  category,
  items,
}: RelatedResearchProps) {
  const related = items.filter(
    (item) => item.href !== `/research/${currentSlug}` && item.category === category
  );

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <hr className="border-t border-border" />
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">
        Related Research
      </h2>
      <p className="mt-3 text-base leading-relaxed text-secondary">
        Further reading in {category.toLowerCase()}.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {related.slice(0, 3).map((item) => (
          <ResearchCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/research"
          className="text-sm font-medium text-foreground transition-colors duration-150 hover:text-secondary"
        >
          View all research &rarr;
        </Link>
      </div>
    </section>
  );
}