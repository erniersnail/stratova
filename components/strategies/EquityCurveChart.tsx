type ChartPoint = {
  date: string; // YYYY-MM-DD
  value: number; // already normalized (e.g. 100 at inception)
};

type EquityCurveChartProps = {
  data: ChartPoint[];
  height?: number; // default 280
};

const VIEW_W = 600;
const PAD_LEFT = 8;
const PAD_RIGHT = 14;
const PAD_TOP = 10;
const LABEL_H = 20;

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
  height = 280,
}: EquityCurveChartProps) {
  const points = (data ?? []).filter(
    (p) => p && typeof p.date === "string" && Number.isFinite(p.value),
  );

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-border"
        style={{ height }}
      >
        <p className="text-sm text-tertiary">No performance data yet.</p>
      </div>
    );
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