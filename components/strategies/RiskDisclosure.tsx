import { typography } from "@/lib/typography";

type RiskDisclosureProps = {
  disclosure: string;
};

export default function RiskDisclosure({ disclosure }: RiskDisclosureProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
        Risk Disclosure
      </h2>
      <p className={`${typography.body} mt-3 text-sm text-secondary`}>
        {disclosure}
      </p>
    </div>
  );
}