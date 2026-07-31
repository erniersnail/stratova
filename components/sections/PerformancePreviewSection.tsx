import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { typography } from "@/lib/typography";

export default function PerformancePreviewSection() {
  return (
    <Section spacing="lg">
      <Container size="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left column */}
          <div className="lg:col-span-2">
            <span className="text-sm font-medium tracking-widest text-secondary">
              PERFORMANCE
            </span>
            <h2 className={`${typography.h2} mt-4`}>
              Performance Reporting
            </h2>
            <p className={`${typography.body} mt-4 text-secondary`}>
              Performance should always be interpreted alongside methodology,
              benchmark selection, assumptions, portfolio construction,
              turnover, and risk characteristics.
            </p>
            <p className={`${typography.body} mt-4 text-secondary`}>
              Our reporting framework is designed to emphasize transparency
              over headline numbers.
            </p>
            <div className="mt-6">
              <Button href="/methodology" variant="secondary" size="md">
                View Methodology
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-border bg-surface p-6">
              {/* Paper header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">Performance Reporting</h3>
                  <p className="mt-1 text-sm text-secondary">
                    Benchmark Comparison &middot; Portfolio Growth &middot; Risk
                    Metrics
                  </p>
                </div>
                <span className="shrink-0 text-xs text-secondary">
                  Available alongside published research.
                </span>
              </div>

              {/* Chart placeholder */}
              <div
                className="relative mt-6 h-[240px] w-full rounded-md border border-border"
                role="img"
                aria-label="Chart placeholder. Empty plotting area with labeled axes. No data is displayed because performance is presented alongside methodology in a private setting."
              >
                <svg
                  viewBox="0 0 600 240"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  {/* Y-axis */}
                  <line
                    x1="80"
                    y1="20"
                    x2="80"
                    y2="200"
                    stroke="#E5E4E0"
                    strokeWidth="1"
                  />
                  {/* X-axis */}
                  <line
                    x1="80"
                    y1="200"
                    x2="580"
                    y2="200"
                    stroke="#E5E4E0"
                    strokeWidth="1"
                  />
                  {/* Grid lines */}
                  <line
                    x1="80"
                    y1="65"
                    x2="580"
                    y2="65"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="80"
                    y1="110"
                    x2="580"
                    y2="110"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="80"
                    y1="155"
                    x2="580"
                    y2="155"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  {/* Axis labels */}
                  <text
                    x="85"
                    y="204"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    0
                  </text>
                  <text
                    x="85"
                    y="69"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    100
                  </text>
                  <text
                    x="85"
                    y="114"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    50
                  </text>
                </svg>
              </div>
            </div>

            {/* Muted note */}
            <p className="mt-4 text-xs leading-relaxed text-secondary">
              Historical performance, when presented, will always include
              benchmark comparisons, methodology, assumptions, and appropriate
              disclosures.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}