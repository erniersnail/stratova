import SectionHeader from "@/components/common/SectionHeader";

type AnnualReturnRow = {
  year: string;
  strategy: string;
  benchmark: string;
};

type AnnualReturnsProps = {
  rows: AnnualReturnRow[];
  benchmarkLabel: string;
};

function isPositive(value: string): boolean {
  return value.startsWith("+");
}

export default function AnnualReturns({ rows, benchmarkLabel }: AnnualReturnsProps) {
  return (
    <div>
      <SectionHeader title="Annual Returns" centered={false} />
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left">
          <caption className="sr-only">
            Annual returns by calendar year for the strategy and benchmark.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wide text-secondary uppercase"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium tracking-wide text-secondary uppercase"
              >
                Strategy
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium tracking-wide text-secondary uppercase"
              >
                {benchmarkLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.year}
                className="border-b border-border last:border-b-0 hover:bg-surface-hover"
              >
                <td className="px-6 py-3 text-sm text-secondary">{row.year}</td>
                <td
                  className={`px-6 py-3 text-right text-sm tabular-nums ${
                    isPositive(row.strategy)
                      ? "text-[#059669]"
                      : "text-[#DC2626]"
                  }`}
                >
                  {row.strategy}
                </td>
                <td
                  className={`px-6 py-3 text-right text-sm tabular-nums ${
                    isPositive(row.benchmark)
                      ? "text-[#059669]"
                      : "text-[#DC2626]"
                  }`}
                >
                  {row.benchmark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-secondary">
        Returns are stated on a net basis, after estimated transaction costs.
        Annual returns are shown for the research period and are presented for
        informational purposes only.
      </p>
    </div>
  );
}