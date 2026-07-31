import type { ResearchItem } from "@/lib/research";
import ResearchCard from "@/components/research/ResearchCard";

type ResearchGridProps = {
  items: ResearchItem[];
};

export default function ResearchGrid({ items }: ResearchGridProps) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-secondary">
        No research papers found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ResearchCard key={item.id} item={item} />
      ))}
    </div>
  );
}