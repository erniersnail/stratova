import Link from "next/link";
import type { ResearchItem } from "@/lib/research";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type ResearchCardProps = {
  item: ResearchItem;
};

export default function ResearchCard({ item }: ResearchCardProps) {
  return (
    <Paper hover className="h-full">
      <Link href={item.href} className="flex h-full flex-col">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <span>{item.category}</span>
          <span aria-hidden="true" className="text-border">/</span>
          <span>{item.date}</span>
        </div>
        <h3 className="mt-3 text-xl font-medium leading-snug">{item.title}</h3>
        <p className={`${typography.body} mt-2 flex-1 text-secondary`}>
          {item.abstract}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-tertiary">{item.readingTime}</span>
          <span className="text-sm font-medium text-foreground">
            Read Research &rarr;
          </span>
        </div>
      </Link>
    </Paper>
  );
}