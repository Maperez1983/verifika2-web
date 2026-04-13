import Image from "next/image";

function hashHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) % 360;
  }
  return h;
}

export default function ListingCover({
  id,
  tone = "light",
  label,
}: {
  id: string;
  tone?: "light" | "dark";
  label?: string;
}) {
  const hue = hashHue(id || "v2");
  const top = `hsla(${hue}, 88%, ${tone === "dark" ? "34%" : "92%"}, 1)`;
  const bottom = `hsla(${(hue + 36) % 360}, 82%, ${tone === "dark" ? "20%" : "86%"}, 1)`;
  const glow = `hsla(${(hue + 18) % 360}, 82%, ${tone === "dark" ? "62%" : "60%"}, 0.35)`;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[color:var(--border)]"
      style={{
        background: `linear-gradient(135deg, ${top}, ${bottom})`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle at center, ${glow}, rgba(0,0,0,0) 62%)` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.0),rgba(255,255,255,0.55))]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-2xl bg-[color:var(--surface)]/80 px-3 py-2 text-xs font-semibold text-slate-700 backdrop-blur">
        <Image src="/brand/verifika2_mark.svg" alt="" width={16} height={16} />
        <span>{label || "Verificado"}</span>
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
        <div className="rounded-2xl bg-[color:var(--surface)]/80 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur">
          Galería (demo)
        </div>
        <div className="rounded-2xl bg-[color:var(--surface)]/80 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur">
          Evidencias · Trazabilidad
        </div>
      </div>
    </div>
  );
}

