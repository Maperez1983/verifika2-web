import Image from "next/image";

export default function AgencyBadge({
  name,
  logo,
  compact = false,
}: {
  name?: string;
  logo?: string | null;
  compact?: boolean;
}) {
  const agencyName = (name || "Verifika2").trim();
  const initial = agencyName.slice(0, 1).toUpperCase() || "V";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--border)] bg-white shadow-sm">
        {logo ? (
          // Agency logos can come from CRM uploads or external domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={agencyName}
            className="h-full w-full object-contain p-1"
          />
        ) : agencyName === "Verifika2" ? (
          <Image src="/brand/verifika2_mark.svg" alt="" width={18} height={18} />
        ) : (
          <span className="text-xs font-semibold text-slate-700">{initial}</span>
        )}
      </div>
      <div className="min-w-0">
        {!compact ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Publica
          </p>
        ) : null}
        <p className="truncate text-sm font-semibold text-slate-800">
          {agencyName}
        </p>
      </div>
    </div>
  );
}
