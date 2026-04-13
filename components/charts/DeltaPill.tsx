export default function DeltaPill({
  current,
  previous,
  label = "vs. periodo anterior",
}: {
  current: number;
  previous: number;
  label?: string;
}) {
  const delta = current - previous;
  const pct = previous > 0 ? (delta / previous) * 100 : current > 0 ? 100 : 0;
  const up = delta >= 0;
  const tone =
    delta === 0
      ? "bg-slate-100 text-slate-700"
      : up
        ? "bg-emerald-50 text-emerald-800"
        : "bg-amber-50 text-amber-900";

  const arrow = delta === 0 ? "·" : up ? "↑" : "↓";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tone}`}>
      <span>
        {arrow} {Math.abs(Math.round(pct))}%
      </span>
      <span className="opacity-70">{label}</span>
    </div>
  );
}

