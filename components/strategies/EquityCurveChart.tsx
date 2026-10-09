import { useId } from "react";

export type ChartPoint = {
  date: string; // YYYY-MM-DD
  value: number; // already normalized (e.g. 100 at inception)
};

export type ChartSeries = {
  name: string;
  data: ChartPoint[];
  color?: string;
  /** Visual weight. Primary = thick solid line + area fill; secondary = thin, faded. Defaults to primary for the first series. */
  emphasis?: "primary" | "secondary";
};

type EquityCurveChartProps = {
  data?: ChartPoint[]; // single-series mode (strategy detail page)
  series?: ChartSeries[]; // multi-series mode; takes precedence when provided
  height?: number; // default 280
};

/** Line colors for multi-series mode, darkest first. */
export const SERIES_COLORS = ["#111111", "#2f6fdb", "#6e6c67", "#a8a29a"];

/**
 * Compute "nice" y-axis ticks within a padded data range.
 * Picks a step from {1,2,2.5,5,10} × 10^n so the span divides into ~3–5
 * ticks, emits multiples of that step inside [min, max], and always
 * includes 100 when it lies in range (rebased-to-100 charts). Returns
 * ascending values; callers format them as ints or one decimal.
 */
function niceTicks(min: number, max: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [];
  }
  const range = max - min;
  const rawStep = range / 4; // aim for ~4 intervals → 3–5 ticks
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / magnitude;
  let base: number;
  if (norm <= 1) base = 1;
  else if (norm <= 2) base = 2;
  else if (norm <= 2.5) base = 2.5;
  else if (norm <= 5) base = 5;
  else base = 10;

  // Sparse-tick guard: if the chosen step yields <3 ticks, halve it (up to
  // 2 retries) so wide ranges still show 3+ gridlines.
  const emitTicks = (step: number): number[] => {
    const out: number[] = [];
    const start = Math.ceil(min / step) * step;
    for (let t = start; t <= max + step * 1e-6; t += step) {
      out.push(Math.round(t / step) * step);
    }
    return out;
  };
  let step = base * magnitude;
  let ticks = emitTicks(step);
  for (let i = 0; i < 2 && ticks.length < 3; i++) {
    step = step / 2;
    ticks = emitTicks(step);
  }

  const hasBaseline = ticks.some((t) => Math.abs(t - 100) < step * 1e-6);
  if (!hasBaseline && 100 >= min && 100 <= max) {
    ticks.push(100);
    ticks.sort((a, b) => a - b);
  }
  return ticks;
}

/** End-of-line value label: percent change from the 100 baseline, signed. */
function endLabel(value: number): string {
  const delta = value - 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%`;
}

/** Y-axis label: tick value T → signed integer percent vs the 100 baseline. */
function pctLabel(t: number): string {
  const p = Math.round(t - 100);
  return p > 0 ? `+${p}%` : `${p}%`;
}

/** Short x-axis date: "2026-08-03" → "Aug 3" (month + day, no year). */
function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * Stagger label y-positions so nearby endpoints don't overlap. Items whose
 * y is within `minGap` of a previously-placed label are nudged down by
 * `stagger` until clear (or a small cap is hit).
 */
function staggerLabels(
  entries: { key: string; y: number }[],
  minGap = 13,
  stagger = 12,
): Map<string, number> {
  const sorted = [...entries].sort((a, b) => a.y - b.y);
  const result = new Map<string, number>();
  let lastY = -Infinity;
  for (const e of sorted) {
    let y = e.y;
    if (y - lastY < minGap) y = lastY + stagger;
    result.set(e.key, y);
    lastY = y;
  }
  return result;
}

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
const PAD_LEFT = 38; // room for right-aligned percentage y-axis labels
const PAD_RIGHT = 56; // room for end-of-line value labels
const PAD_TOP = 10;
const LABEL_H = 20;

export type MultiSeriesEntry = {
  name: string;
  points: ChartPoint[];
  color?: string;
  emphasis?: "primary" | "secondary";
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
  const gradId = `area-${useId()}`;

  // Multi-series mode takes precedence when the prop is provided.
  if (series !== undefined) {
    const cleaned: MultiSeriesEntry[] = series
      .map((s, si) => ({
        name: s.name,
        points: (s.data ?? []).filter(isValidPoint),
        color: s.color ?? SERIES_COLORS[si % SERIES_COLORS.length],
        emphasis: s.emphasis ?? (si === 0 ? "primary" : "secondary"),
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

  // Y gridlines at nice round values within the padded domain � purely
  // visual, never affect scaling.
  const gridlines = niceTicks(min, max);




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
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111111" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#111111" stopOpacity={0} />
        </linearGradient>
      </defs>
      {gridlines.map((g) => {
        const isBaseline = Math.abs(g - 100) < 1e-6;
        return (
          <line
            key={g}
            x1={PAD_LEFT}
            x2={VIEW_W - PAD_RIGHT}
            y1={y(g)}
            y2={y(g)}
            stroke="currentColor"
            strokeWidth={isBaseline ? 1.5 : 1}
            strokeDasharray={isBaseline ? "2 4" : undefined}
            vectorEffect="non-scaling-stroke"
            className={isBaseline ? "text-foreground/20" : "text-border"}
          />
        );
      })}
      {/* Area fill under the (primary) strategy line */}
      <path
        d={`${d} L${x(n - 1).toFixed(2)},${(PAD_TOP + plotH).toFixed(2)} L${x(0).toFixed(2)},${(PAD_TOP + plotH).toFixed(2)} Z`}
        fill={`url(#${gradId})`}
        stroke="none"
      />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
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
      {/* End-of-line value label */}
      <text
        x={x(n - 1) + 8}
        y={y(last.value) + 4}
        fontSize={11}
        fontWeight={500}
        fill="currentColor"
        className="text-foreground"
      >
        {endLabel(last.value)}
      </text>
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
            className="text-foreground/90"
          >
            {shortDate(points[i].date)}
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
  emphasis?: "primary" | "secondary";
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

  // Y gridlines at nice round values within the padded domain � purely
  // visual, never affect scaling.
  const gridlines = niceTicks(min, max);




  // X labels: first, middle, last of the shared date axis.
  const labelIdx = Array.from(
    new Set([0, Math.floor((m - 1) / 2), m - 1]),
  ).sort((a, b) => a - b);
  const anchor = (pos: number) =>
    pos === 0 ? "start" : pos === labelIdx.length - 1 ? "end" : "middle";

  const names = series.map((s) => s.name).join(", ");
  const gradId = `area-${useId()}`;
  const primary = series.find((s) => s.emphasis !== "secondary") ?? series[0];

  // Pre-compute staggered end-label y-positions so nearby endpoints don't overlap.
  const labelPositions = staggerLabels(
    series.map((s) => ({
      key: s.name,
      y: y(s.points[s.points.length - 1].value),
    })),
  );

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${VIEW_W} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Equity curves, ${allDates[0]} to ${allDates[m - 1]}: ${names}`}
      >
      <title>{`Equity curves for ${names}, ${allDates[0]} to ${allDates[m - 1]}`}</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={primary.color ?? "#111111"}
            stopOpacity={0.12}
          />
          <stop
            offset="100%"
            stopColor={primary.color ?? "#111111"}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      {gridlines.map((g) => {
        const isBaseline = Math.abs(g - 100) < 1e-6;
        return (
          <line
            key={g}
            x1={PAD_LEFT}
            x2={VIEW_W - PAD_RIGHT}
            y1={y(g)}
            y2={y(g)}
            stroke="currentColor"
            strokeWidth={isBaseline ? 1.5 : 1}
            strokeDasharray={isBaseline ? "2 4" : undefined}
            vectorEffect="non-scaling-stroke"
            className={isBaseline ? "text-foreground/20" : "text-border"}
          />
        );
      })}
      {series.map((s, si) => {
        const color = s.color ?? SERIES_COLORS[si % SERIES_COLORS.length];
        const isPrimary = s.emphasis !== "secondary";
        const d = s.points
          .map((p, i) => `${i === 0 ? "M" : "L"}${xDate(p.date).toFixed(2)},${y(p.value).toFixed(2)}`)
          .join(" ");
        const lastPt = s.points[s.points.length - 1];
        const areaD = `${d} L${xDate(lastPt.date).toFixed(2)},${(PAD_TOP + plotH).toFixed(2)} L${xDate(s.points[0].date).toFixed(2)},${(PAD_TOP + plotH).toFixed(2)} Z`;
        return (
          <g key={`${si}-${s.name}`}>
            {isPrimary && (
              <path d={areaD} fill={`url(#${gradId})`} stroke="none" />
            )}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={isPrimary ? 2.5 : 1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={isPrimary ? 1 : 0.8}
            />
            <circle
              cx={xDate(lastPt.date)}
              cy={y(lastPt.value)}
              r={3.5}
              fill={color}
            />
            <text
              x={xDate(lastPt.date) + 8}
              y={(labelPositions.get(s.name) ?? y(lastPt.value)) + 4}
              fontSize={11}
              fontWeight={500}
              fill={color}
            >
              {endLabel(lastPt.value)}
            </text>
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
          className="text-foreground/90"
        >
          {shortDate(allDates[pos])}
        </text>
      ))}
      </svg>
      {/* Percentage y-axis labels as HTML overlay (immune to SVG stretch) */}
      {Array.from(new Set(gridlines.map(pctLabel))).map((label) => {
        const g = gridlines.find((t) => pctLabel(t) === label);
        if (g === undefined) return null;
        return (
          <span
            key={`yp-${label}`}
            className="absolute -translate-y-1/2 text-[11px] leading-none text-tertiary"
            style={{
              top: `${y(g)}px`,
              left: `calc(${(PAD_LEFT / VIEW_W) * 100}% - 6px)`,
              transform: "translateX(-100%) translateY(-50%)",
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
