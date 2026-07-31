import { RESEARCH_CATEGORIES } from "@/lib/research";

export default function ResearchFilters() {
  return (
    <div className="flex flex-wrap gap-2">
      {RESEARCH_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
            category === "All"
              ? "border-foreground bg-foreground text-white"
              : "border-border bg-surface text-secondary hover:border-foreground hover:text-foreground"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}