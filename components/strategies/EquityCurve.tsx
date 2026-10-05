"use client";

type EquityCurveProps = {
  labels: string[];
  strategy: number[];
  benchmark: number[];
  benchmarkLabel: string;
};

const WIDTH = 800;
const HEIGHT = 340;
const PADDING_LEFT = 72;
const PADDING_RIGHT = 20;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 32;

const INITIAL_INVESTMENT = 1_000_000;

function formatCurrency(value: number): string {
  if (value >= 10_000_000) {
    const crores = value / 10_000_000;
    const formatted = Number.isInteger(crores)
      ? crores.toFixed(0)
      : crores.toFixed(2);
    return `₹${formatted}Cr`;
  }
  if (value >= 100_000) {
    const lakhs = value / 100_000;
    const formatted = Number.isInteger(lakhs)
      ? lakhs.toFixed(0)
      : lakhs.toFixed(2);
    return `₹${formatted}L`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    const formatted = Number.isInteger(thousands)
      ? thousands.toFixed(0)
      : thousands.toFixed(1);
    return `₹${formatted}K`;
  }
  return `₹${value}`;
}

function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min;
  if (span <= 0) {
    return [min];
  }
  const rawStep = span / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  let step: number;
  if (normalized < 1.5) {
    step = 1;
  } else if (normalized < 3) {
    step = 2;
  } else if (normalized < 7) {
    step = 5;
  } else {
    step = 10;
  }
  step *= magnitude;

  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = first; v <= max + step * 0.001; v += step) {
    ticks.push(Math.round(v * 100) / 100);
  }
  return ticks;
}

type Point = { x: number; y: number };

function buildSmoothPath(points: Point[]): string {
  if (points.length < 2) {
    return "";
  }
  if (points.length === 2) {
    return `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)} L${points[1].x.toFixed(2)},${points[1].y.toFixed(2)}`;
  }

  let d = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function EquityCurve({
  labels,
  strategy,
  benchmark,
  benchmarkLabel,
}: EquityCurveProps) {
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const allValues = [...strategy, ...benchmark];
  const maxValue = Math.max(...allValues);
  const paddedMax = maxValue * 1.08;
  const paddedMin = 0;

  const xFor = (i: number) =>
    PADDING_LEFT + (i / (labels.length - 1)) * plotWidth;
  const yFor = (value: number) =>
    PADDING_TOP + plotHeight - ((value - paddedMin) / (paddedMax - paddedMin)) * plotHeight;

  const strategyPoints: Point[] = strategy.map((v, i) => ({
    x: xFor(i),
    y: yFor(v),
  }));
  const benchmarkPoints: Point[] = benchmark.map((v, i) => ({
    x: xFor(i),
    y: yFor(v),
  }));

  const strategyPath = buildSmoothPath(strategyPoints);
  const benchmarkPath = buildSmoothPath(benchmarkPoints);

  const baselineY = PADDING_TOP + plotHeight;
  const firstX = strategyPoints[0].x;
  const lastX = strategyPoints[strategyPoints.length - 1].x;

  const strategyArea = `${strategyPath} L${lastX.toFixed(2)},${baselineY} L${firstX.toFixed(2)},${baselineY} Z`;
  const benchmarkArea = `${benchmarkPath} L${lastX.toFixed(2)},${baselineY} L${firstX.toFixed(2)},${baselineY} Z`;

  const ticks = niceTicks(paddedMin, paddedMax, 5);
  const startingY = yFor(INITIAL_INVESTMENT);

  const strategyEnd = strategy[strategy.length - 1];
  const benchmarkEnd = benchmark[benchmark.length - 1];
  const startYear = labels[0];
  const endYear = labels[labels.length - 1];

  return (
      <div
        className="relative w-full"
        role="img"
        aria-label={`Equity curve chart showing growth of a ${formatCurrency(INITIAL_INVESTMENT)} investment from ${startYear} to ${endYear}. The strategy grows to ${formatCurrency(strategyEnd)}, while the benchmark grows to ${formatCurrency(benchmarkEnd)}.`}
      >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="strategyAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="benchmarkAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              y1={yFor(tick)}
              x2={WIDTH - PADDING_RIGHT}
              y2={yFor(tick)}
              stroke="#C9C7C1"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <text
              x={PADDING_LEFT - 8}
              y={yFor(tick) + 3}
              fill="#6E6C67"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="end"
            >
              {formatCurrency(tick)}
            </text>
          </g>
        ))}

        {/* Initial ₹10L investment reference line */}
        <line
          x1={PADDING_LEFT}
          y1={startingY}
          x2={WIDTH - PADDING_RIGHT}
          y2={startingY}
          stroke="#3B82F6"
          strokeWidth="0.75"
          strokeDasharray="4 4"
          opacity="0.45"
        />
        <text
          x={WIDTH - PADDING_RIGHT - 4}
          y={startingY - 5}
          fill="#3B82F6"
          fontSize="9"
          fontFamily="Inter, sans-serif"
          textAnchor="end"
          opacity="0.8"
        >
          ₹10L invested
        </text>

        {/* Area fills */}
        <path d={benchmarkArea} fill="url(#benchmarkAreaGradient)" />
        <path d={strategyArea} fill="url(#strategyAreaGradient)" />

        {/* Benchmark curve */}
        <path
          d={benchmarkPath}
          fill="none"
          stroke="#4B5563"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Strategy curve */}
        <path
          d={strategyPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Start markers */}
        <circle
          cx={benchmarkPoints[0].x}
          cy={benchmarkPoints[0].y}
          r="3.5"
          fill="#4B5563"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle
          cx={strategyPoints[0].x}
          cy={strategyPoints[0].y}
          r="3.5"
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />

        {/* End markers */}
        <circle
          cx={lastX}
          cy={strategyPoints[strategyPoints.length - 1].y}
          r="4.5"
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle
          cx={lastX}
          cy={benchmarkPoints[benchmarkPoints.length - 1].y}
          r="4.5"
          fill="#4B5563"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />

        {/* End value labels */}
        <text
          x={lastX - 8}
          y={strategyPoints[strategyPoints.length - 1].y - 8}
          fill="#3B82F6"
          fontSize="10.5"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
          textAnchor="end"
        >
          {formatCurrency(strategyEnd)}
        </text>
        <text
          x={lastX - 8}
          y={benchmarkPoints[benchmarkPoints.length - 1].y - 8}
          fill="#4B5563"
          fontSize="10.5"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
          textAnchor="end"
        >
          {formatCurrency(benchmarkEnd)}
        </text>

        {/* Y-axis */}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT}
          y2={baselineY}
          stroke="#C9C7C1"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={PADDING_LEFT}
          y1={baselineY}
          x2={WIDTH - PADDING_RIGHT}
          y2={baselineY}
          stroke="#C9C7C1"
          strokeWidth="1"
        />

        {/* X-axis labels (every other year) */}
        {labels.map((label, i) =>
          i % 2 === 0 ? (
            <text
              key={`${label}-${i}`}
              x={xFor(i)}
              y={HEIGHT - 8}
              fill="#6E6C67"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              {label}
            </text>
          ) : null
        )}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
        <span className="inline-flex items-center gap-2 text-sm">
          <span
            className="inline-block h-[2px] w-6 bg-[#3B82F6]"
            aria-hidden="true"
          />
          <span className="text-secondary">Strategy</span>
          <span className="font-medium text-foreground tabular-nums">
            {formatCurrency(strategyEnd)}
          </span>
        </span>
        <span className="inline-flex items-center gap-2 text-sm">
          <span
            className="inline-block h-[2px] w-6 bg-[#4B5563]"
            aria-hidden="true"
          />
        <span className="text-secondary">{benchmarkLabel}</span>
          <span className="font-medium text-foreground tabular-nums">
            {formatCurrency(benchmarkEnd)}
          </span>
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-tertiary">
        Growth of {formatCurrency(INITIAL_INVESTMENT)} invested at the start of
        {startYear}. Year-end values for {startYear}–{endYear}.
      </p>
    </div>
  );
}