import { useId } from "react";

export type ChartPoint = {
  date: string; // YYYY-MM-DD
  value: number; // already normalized (e.g. 100 at inception)
};

export type ChartSeries = {
  name: string;
  data: ChartPoint[];
  color?: string;
  emphasis?: "primary" | "secondary";
};

type EquityCurveChartProps = {
  data?: ChartPoint[];
  series?: ChartSeries[];
  height?: number;
};

/** Default colors if none provided */
export const SERIES_COLORS = ["var(--color-foreground)", "#b08900", "var(--color-tertiary)", "#a8a29a"];

function niceTicks(min: number, max: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [];
  }
  const range = max - min;
  const rawStep = range / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / magnitude;
  let base: number;
  if (norm <= 1) base = 1;
  else if (norm <= 2) base = 2;
  else if (norm <= 2.5) base = 2.5;
  else if (norm <= 5) base = 5;
  else base = 10;

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

function endLabel(value: number): string {
  const delta = value - 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%`;
}

function pctLabel(t: number): string {
  const p = Math.round(t - 100);
  return p > 0 ? `+${p}%` : `${p}%`;
}

function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

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
const PAD_LEFT = 38;
const PAD_RIGHT = 56;
const PAD_TOP = 10;
const LABEL_H = 20;

export type MultiSeriesEntry = {
  name: string;
  points: ChartPoint[];
  color?: string;
  emphasis?: "primary" | "secondary";
};

export default function EquityCurveChart({
  data,
  series,
  height = 280,
}: EquityCurveChartProps) {
  const gradId = `area-${useId()}`;

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

  const gridlines = niceTicks(min, max);

  // X labels: start date and month boundaries only.
  const labelIdx = (() => {
    const idx = new Set<number>([0]);
    for (let i = 1; i < n; i++) {
      const prevMonth = points[i - 1].date.slice(0, 7);
      const currMonth = points[i].date.slice(0, 7);
      if (prevMonth !== currMonth) idx.add(i);
    }
    const sorted = [...idx].sort((a, b) => a - b);
    if (sorted.length <= 6) return sorted;
    const keep: number[] = [sorted[0]];
    const step = (sorted.length - 1) / 4;
    for (let k = 1; k <= 3; k++) keep.push(sorted[Math.round(step * k)]);
    keep.push(sorted[sorted.length - 1]);
    return [...new Set(keep)].sort((a, b) => a - b);
  })();

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
            strokeDasharray={undefined}
            vectorEffect="non-scaling-stroke"
            className={isBaseline ? "text-foreground/20" : "text-border"}
          />
        );
      })}
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
            fontSize={10}
            fontWeight={500}
            fill="currentColor"
            className="text-tertiary"
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

  const gridlines = niceTicks(min, max);

  // X labels: start, month boundaries only.
  const labelIdx = (() => {
    const idx = new Set<number>([0]);
    for (let i = 1; i < m; i++) {
      const prevMonth = allDates[i - 1].slice(0, 7);
      const currMonth = allDates[i].slice(0, 7);
      if (prevMonth !== currMonth) idx.add(i);
    }
    const sorted = [...idx].sort((a, b) => a - b);
    if (sorted.length <= 6) return sorted;
    const keep: number[] = [sorted[0]];
    const step = (sorted.length - 1) / 4;
    for (let k = 1; k <= 3; k++) keep.push(sorted[Math.round(step * k)]);
    keep.push(sorted[sorted.length - 1]);
    return [...new Set(keep)].sort((a, b) => a - b);
  })();

  const anchor = (pos: number) =>
    pos === 0 ? "start" : pos === labelIdx.length - 1 ? "end" : "middle";

  const names = series.map((s) => s.name).join(", ");
  const primary = series.find((s) => s.emphasis !== "secondary") ?? series[0];

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
            strokeDasharray={undefined}
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
        return (
          <g key={`${si}-${s.name}`}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={isPrimary ? 3 : 1.5}
              strokeDasharray={isPrimary ? undefined : "4 4"}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={isPrimary ? 1 : 0.9}
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
          fontSize={10}
          fontWeight={500}
          fill="currentColor"
          className="text-tertiary"
        >
          {shortDate(allDates[pos])}
        </text>
      ))}
      </svg>
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
