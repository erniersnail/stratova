"use client";

type DrawdownChartProps = {
  labels: string[];
  strategy: number[];
  benchmark: number[];
  benchmarkLabel: string;
};

const WIDTH = 600;
const HEIGHT = 240;
const PADDING_LEFT = 55;
const PADDING_RIGHT = 15;
const PADDING_TOP = 15;
const PADDING_BOTTOM = 28;

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

export default function DrawdownChart({
  labels,
  strategy,
  benchmark,
  benchmarkLabel,
}: DrawdownChartProps) {
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const allValues = [...strategy, ...benchmark];
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 5);
  const paddedMin = minValue * 1.1;
  const paddedMax = maxValue <= 0 ? 2 : maxValue * 1.1;

  const xFor = (i: number) =>
    PADDING_LEFT + (i / (labels.length - 1)) * plotWidth;
  const yFor = (value: number) =>
    PADDING_TOP + plotHeight - ((value - paddedMin) / (paddedMax - paddedMin)) * plotHeight;

  const strategyArea = strategy
    .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`)
    .join(" ");
  const benchmarkArea = benchmark
    .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`)
    .join(" ");

  // Generate ticks from the padded min up to 0
  const ticks = niceTicks(Math.floor(paddedMin), 0);

  return (
    <div
      className="relative w-full"
      role="img"
      aria-label="Drawdown chart showing strategy drawdowns versus QQQ benchmark from 2010 to 2025. The strategy reaches a maximum drawdown of approximately negative 44 percent, while the benchmark reaches approximately negative 33 percent."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
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
              x={PADDING_LEFT - 6}
              y={yFor(tick) + 3}
              fill="#6E6C67"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="end"
            >
              {tick}%
            </text>
          </g>
        ))}

        {/* Benchmark area */}
        <path
          d={`${benchmarkArea} L${PADDING_LEFT + plotWidth},${yFor(0)} L${PADDING_LEFT},${yFor(0)} Z`}
          fill="rgba(75, 85, 99, 0.12)"
          stroke="#4B5563"
          strokeWidth="1.5"
        />

        {/* Strategy area */}
        <path
          d={`${strategyArea} L${PADDING_LEFT + plotWidth},${yFor(0)} L${PADDING_LEFT},${yFor(0)} Z`}
          fill="rgba(220, 38, 38, 0.08)"
          stroke="#DC2626"
          strokeWidth="1.5"
        />

        {/* Zero line */}
        <line
          x1={PADDING_LEFT}
          y1={yFor(0)}
          x2={WIDTH - PADDING_RIGHT}
          y2={yFor(0)}
          stroke="#C9C7C1"
          strokeWidth="1"
        />

        {/* Y-axis */}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke="#C9C7C1"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={PADDING_LEFT}
          y1={HEIGHT - PADDING_BOTTOM}
          x2={WIDTH - PADDING_RIGHT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke="#C9C7C1"
          strokeWidth="1"
        />

        {/* X-axis labels (subset) */}
        {labels.map((label, i) =>
          i % 2 === 0 ? (
            <text
              key={label}
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

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2 text-xs text-secondary">
          <span className="inline-block h-[2px] w-5 bg-[#DC2626]" aria-hidden="true" />
          Strategy
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-secondary">
          <span className="inline-block h-[2px] w-5 bg-[#4B5563]" aria-hidden="true" />
          {benchmarkLabel}
        </span>
      </div>
    </div>
  );
}