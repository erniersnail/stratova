export type ChartPoint = {
  date: string; // YYYY-MM-DD
  value: number; // already normalized (e.g. 100 at inception)
};

export type ChartSeries = {
  name: string;
  data: ChartPoint[];
  color?: string;
};

type EquityCurveChartProps = {
  data?: ChartPoint[]; // single-series mode (strategy detail page)
  series?: ChartSeries[]; // multi-series mode; takes precedence when provided
  height?: number; // default 280
};

/** Line colors for multi-series mode, darkest first. */
export const SERIES_COLORS = ["#111111", "#2f6fdb", "#6e6c67", "#a8a29a"];

function isValidPoint(p: ChartPoint): boolean {
  return !!p && typeof p.date === "string" && Number.isFinite(p.value);
}

function ChartPlaceholder({ height }: { height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-md border border-border"
      style={{ height }}
    >
      <p className="text-sm text-tertiary">No performance data yet.</p>
    </div>
  );
}

const VIEW_W = 600;
const PAD_LEFT = 8;
const PAD_RIGHT = 14;
const PAD_TOP = 10;
const LABEL_H = 20;

export type MultiSeriesEntry = {
  name: string;
  points: ChartPoint[];
  color?: string;
};

/**
 * Minimal static equity-curve chart. Server component, hand-rolled inline
 * SVG — no chart libraries, no interactivity, no tooltips.
 *
 * Degenerate inputs never crash:
 * - empty / all-non-finite data → bordered placeholder, no SVG
 * - single point → centered dot with its date label
 * - all-same values → artificial ±1 range centers a flat line
 */
export default function EquityCurveChart({
  data,
  series,
  height = 280,
}: EquityCurveChartProps) {
  // Multi-series mode takes precedence when the prop is provided.
  if (series !== undefined) {
    const cleaned: MultiSeriesEntry[] = series
      .map((s, si) => ({
        name: s.name,
        points: (s.data ?? []).filter(isValidPoint),
        color: s.color ?? SERIES_COLORS[si % SERIES_COLORS.length],
      }))
      .filter((s) => s.points.length >= 2);
    if (cleaned.length === 0) return <ChartPlaceholder height={height} />;
    return <MultiSeriesChart series={cleaned} height={height} />;
  }

  const points = (data ?? []).filter(isValidPoint);

  if (points.length === 0) {
    return <ChartPlaceholder height={height} />;
  }

  const plotH = Math.max(height - PAD_TOP - LABEL_H, 40);
  const n = points.length;

  let min = points[0].value;
  let max = points[0].value;
  for (const p of points) {
    if (p.value < min) min = p.value;
    if (p.value > max) max = p.value;
  }
  if (min === max) {
    min -= 1;
    max += 1;
  } else {
    const pad = (max - min) * 0.05;
    min -= pad;
    max += pad;
  }
  const span = max - min;

  const x = (i: number) =>
    n === 1
      ? VIEW_W / 2
      : PAD_LEFT + (i / (n - 1)) * (VIEW_W - PAD_LEFT - PAD_RIGHT);
  const y = (v: number) => PAD_TOP + (1 - (v - min) / span) * plotH;

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`)
    .join(" ");

  // Y gridlines at fixed fractions of the padded domain — purely visual,
  // never affect scaling.
  const gridlines = Array.from(
    new Set(
      [0.25, 0.5, 0.75].map((f) => Math.round((min + span * f) * 100) / 100),
    ),
  );

  // X labels: first, middle, last — deduped (3 max, fewer for tiny series).
  const labelIdx = Array.from(
    new Set([0, Math.floor((n - 1) / 2), n - 1]),
  ).sort((a, b) => a - b);
  const anchor = (pos: number) =>
    pos === 0 ? "start" : pos === labelIdx.length - 1 ? "end" : "middle";

  const last = points[n - 1];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${VIEW_W} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Equity curve, ${points[0].date} to ${last.date}`}
    >
      <title>{`Equity curve from ${points[0].date} to ${last.date}`}</title>
      {gridlines.map((g) => (
        <line
          key={g}
          x1={PAD_LEFT}
          x2={VIEW_W - PAD_RIGHT}
          y1={y(g)}
          y2={y(g)}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="text-border"
        />
      ))}
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-foreground"
      />
      <circle
        cx={x(n - 1)}
        cy={y(last.value)}
        r={3.5}
        fill="currentColor"
        className="text-foreground"
      />
      {labelIdx.map((pos, k) => {
        const i = pos;
        return (
          <text
            key={`${i}-${points[i].date}`}
            x={x(i)}
            y={PAD_TOP + plotH + 15}
            textAnchor={anchor(k)}
            fontSize={11}
            fill="currentColor"
            className="text-tertiary"
          >
            {points[i].date}
          </text>
        );
      })}
    </svg>
  );
}

type CleanSeries = {
  name: string;
  points: ChartPoint[];
  color?: string;
};

/**
 * Multi-series mode: one line per strategy on a shared date axis.
 * The y-domain spans all series with 5% padding so the full range —
 * not just a single winner — is visible. Same minimal styling as the
 * single-series mode: no interactivity, no tooltips, no dependencies.
 */
function MultiSeriesChart({
  series,
  height,
}: {
  series: CleanSeries[];
  height: number;
}) {
  const allDates = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.date))),
  ).sort();
  const dateIdx = new Map(allDates.map((d, i) => [d, i]));
  const m = allDates.length;

  const plotH = Math.max(height - PAD_TOP - LABEL_H, 40);

  let min = series[0].points[0].value;
  let max = min;
  for (const s of series) {
    for (const p of s.points) {
      if (p.value < min) min = p.value;
      if (p.value > max) max = p.value;
    }
  }
  if (min === max) {
    min -= 1;
    max += 1;
  } else {
    const pad = (max - min) * 0.05;
    min -= pad;
    max += pad;
  }
  const span = max - min;

  const xDate = (date: string) => {
    if (m === 1) return VIEW_W / 2;
    const i = dateIdx.get(date) ?? 0;
    return PAD_LEFT + (i / (m - 1)) * (VIEW_W - PAD_LEFT - PAD_RIGHT);
  };
  const y = (v: number) => PAD_TOP + (1 - (v - min) / span) * plotH;

  // Y gridlines at fixed fractions of the padded domain — purely visual,
  // never affect scaling.
  const gridlines = Array.from(
    new Set(
      [0.25, 0.5, 0.75].map((f) => Math.round((min + span * f) * 100) / 100),
    ),
  );

  // X labels: first, middle, last of the shared date axis.
  const labelIdx = Array.from(
    new Set([0, Math.floor((m - 1) / 2), m - 1]),
  ).sort((a, b) => a - b);
  const anchor = (pos: number) =>
    pos === 0 ? "start" : pos === labelIdx.length - 1 ? "end" : "middle";

  const names = series.map((s) => s.name).join(", ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${VIEW_W} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Equity curves, ${allDates[0]} to ${allDates[m - 1]}: ${names}`}
    >
      <title>{`Equity curves for ${names}, ${allDates[0]} to ${allDates[m - 1]}`}</title>
      {gridlines.map((g) => (
        <line
          key={g}
          x1={PAD_LEFT}
          x2={VIEW_W - PAD_RIGHT}
          y1={y(g)}
          y2={y(g)}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="text-border"
        />
      ))}
      {gridlines.map((g) => (
        <text
          key={`yl-${g}`}
          x={PAD_LEFT + 2}
          y={y(g) - 4}
          fontSize={11}
          fill="currentColor"
          className="text-tertiary"
        >
          {Math.abs(g - Math.round(g)) < 0.05
            ? String(Math.round(g))
            : g.toFixed(1)}
        </text>
      ))}
      {series.map((s, si) => {
        const color = s.color ?? SERIES_COLORS[si % SERIES_COLORS.length];
        const d = s.points
          .map(
            (p, i) =>
              `${i === 0 ? "M" : "L"}${xDate(p.date).toFixed(2)},${y(p.value).toFixed(2)}`,
          )
          .join(" ");
        const lastPt = s.points[s.points.length - 1];
        return (
          <g key={`${si}-${s.name}`}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={xDate(lastPt.date)}
              cy={y(lastPt.value)}
              r={3.5}
              fill={color}
            />
          </g>
        );
      })}
      {labelIdx.map((pos, k) => (
        <text
          key={`${pos}-${allDates[pos]}`}
          x={
            m === 1
              ? VIEW_W / 2
              : PAD_LEFT + (pos / (m - 1)) * (VIEW_W - PAD_LEFT - PAD_RIGHT)
          }
          y={PAD_TOP + plotH + 15}
          textAnchor={anchor(k)}
          fontSize={11}
          fill="currentColor"
          className="text-tertiary"
        >
          {allDates[pos]}
        </text>
      ))}
    </svg>
  );
}