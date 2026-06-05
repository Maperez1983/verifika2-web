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
  src,
  title,
  location,
}: {
  id: string;
  tone?: "light" | "dark";
  label?: string;
  src?: string | null;
  title?: string;
  location?: string;
}) {
  const hue = hashHue(id || "v2");
  const top = `hsla(${hue}, 28%, ${tone === "dark" ? "23%" : "88%"}, 1)`;
  const bottom = `hsla(${(hue + 28) % 360}, 22%, ${tone === "dark" ? "13%" : "80%"}, 1)`;
  const line = `hsla(${(hue + 12) % 360}, 24%, ${tone === "dark" ? "64%" : "38%"}, ${tone === "dark" ? "0.28" : "0.18"})`;

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[color:var(--border)]"
      style={{
        background: `linear-gradient(135deg, ${top}, ${bottom})`,
      }}
    >
      {src ? (
        // CRM photos can be absolute URLs or protected upload paths, so use a plain img instead of Next Image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(115deg, transparent 0 42%, ${line} 42% 43%, transparent 43% 100%),
                linear-gradient(25deg, transparent 0 56%, ${line} 56% 57%, transparent 57% 100%),
                linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0))
              `,
            }}
          />
          <div className="absolute bottom-8 left-8 right-8 border-t border-white/25 pt-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone === "dark" ? "text-white/72" : "text-slate-600"}`}>
              Verifika2
            </p>
            <p className={`pt-2 text-lg font-semibold tracking-tight ${tone === "dark" ? "text-white" : "text-slate-900"}`}>
              {title || "Inmueble verificado"}
            </p>
            {location ? (
              <p className={`pt-1 text-sm ${tone === "dark" ? "text-white/72" : "text-slate-600"}`}>
                {location}
              </p>
            ) : null}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.52))]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
        <Image src="/brand/verifika2_mark.svg" alt="" width={16} height={16} />
        <span>{label || "Verificado"}</span>
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
        <div className="rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-800 shadow-sm backdrop-blur">
          {src ? "Fotos del inmueble" : "Foto pendiente"}
        </div>
        <div className="rounded-full bg-[#0B1D33]/90 px-3 py-2 text-xs font-medium text-white shadow-sm backdrop-blur">
          Documentación revisada
        </div>
      </div>
    </div>
  );
}
