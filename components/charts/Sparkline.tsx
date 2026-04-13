function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export default function Sparkline({
  values,
  width = 140,
  height = 42,
  stroke = "#0B1D33",
  fill = "rgba(242,193,78,0.22)",
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}) {
  const data = values.length ? values : [0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / span) * height;
    return { x: round(x), y: round(clamp(y, 0, height)) };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const area = `${line} L${round(width)},${round(height)} L0,${round(height)} Z`;

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className || "block"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={area} fill={fill} />
      <path d={line} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
