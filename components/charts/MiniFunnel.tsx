function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.round((n / d) * 100);
}

export default function MiniFunnel({
  views,
  leads,
  visits,
}: {
  views: number;
  leads: number;
  visits: number;
}) {
  const base = Math.max(1, views);
  const w1 = 100;
  const w2 = Math.max(8, Math.round((leads / base) * 100));
  const w3 = Math.max(6, Math.round((visits / base) * 100));

  return (
    <div className="space-y-3">
      <Row label="Vistas ficha" value={views} widthPct={w1} tone="dark" helper="100%" />
      <Row label="Solicitudes" value={leads} widthPct={w2} tone="brand" helper={`${pct(leads, views)}%`} />
      <Row label="Visitas" value={visits} widthPct={w3} tone="ok" helper={`${pct(visits, leads)}%`} />
    </div>
  );
}

function Row({
  label,
  value,
  widthPct,
  helper,
  tone,
}: {
  label: string;
  value: number;
  widthPct: number;
  helper: string;
  tone: "dark" | "brand" | "ok";
}) {
  const bar =
    tone === "dark"
      ? "bg-[#0B1D33]"
      : tone === "brand"
        ? "bg-[color:var(--brand)]"
        : "bg-emerald-500";
  const text =
    tone === "brand" ? "text-[color:var(--brand-foreground)]" : "text-white";

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-medium">{label}</span>
        <span>
          <span className="font-semibold text-[color:var(--foreground)]">{value}</span>{" "}
          <span className="opacity-70">· {helper}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${widthPct}%` }} />
      </div>
      <div className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${bar} ${text}`}>
        Conversión
      </div>
    </div>
  );
}

