type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Tiny inline SVG sparkline. No axes, no labels — just the shape.
 * Used on strategy cards to show equity-curve behaviour at a glance.
 * Inherits `currentColor` for stroke.
 */
export default function Sparkline({
  values,
  width = 80,
  height = 28,
  className = "",
}: SparklineProps) {
  if (values.length < 2) return null;

  let min = values[0];
  let max = values[0];
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min || 1;
  const step = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
