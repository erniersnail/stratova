import Link from "next/link";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";
import type { Strategy } from "@/lib/strategies";

type StrategyCardProps = {
  strategy: Strategy;
};

export default function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <Paper hover className="h-full">
      <Link
        href={`/research/${strategy.region === "india" ? "india-equities" : "us-equities"}/${strategy.slug}`}
        className="group flex h-full flex-col"
      >
        <div>
          <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
            {strategy.category}
          </span>
          <h3 className="mt-3 text-xl font-medium leading-snug text-foreground">
            {strategy.title}
          </h3>
          <p className={`${typography.body} mt-3 text-secondary`}>
            {strategy.description}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#059669]"
              aria-hidden="true"
            />
            {strategy.status}
          </span>
          <span aria-hidden="true" className="text-border">/</span>
          <span>Research Period: {strategy.researchPeriod}</span>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-secondary">
            View Strategy &rarr;
          </span>
        </div>
      </Link>
    </Paper>
  );
}