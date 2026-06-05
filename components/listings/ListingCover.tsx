"use client";

import Image from "next/image";
import { useState } from "react";

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
  propertyType,
}: {
  id: string;
  tone?: "light" | "dark";
  label?: string;
  src?: string | null;
  title?: string;
  location?: string;
  propertyType?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hue = hashHue(id || "v2");
  const top = `hsla(${hue}, 18%, ${tone === "dark" ? "24%" : "90%"}, 1)`;
  const bottom = `hsla(${(hue + 34) % 360}, 16%, ${tone === "dark" ? "12%" : "78%"}, 1)`;
  const line = `hsla(${(hue + 12) % 360}, 18%, ${tone === "dark" ? "64%" : "36%"}, ${tone === "dark" ? "0.24" : "0.16"})`;
  const typeLabel = propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : "Inmueble";
  const photoSrc = src && !failed ? src : null;
  const showPhoto = Boolean(photoSrc && loaded);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[26px] border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]"
      style={{
        background: `linear-gradient(135deg, ${top}, ${bottom})`,
      }}
    >
      {!showPhoto ? (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(115deg, transparent 0 42%, ${line} 42% 43%, transparent 43% 100%),
                linear-gradient(25deg, transparent 0 56%, ${line} 56% 57%, transparent 57% 100%),
                linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0)),
                radial-gradient(circle at 78% 24%, rgba(242,193,78,0.26), transparent 28%)
              `,
            }}
          />
          <div className="absolute left-8 top-8 h-16 w-24 rounded-sm border border-white/28 bg-white/12" />
          <div className="absolute left-20 top-20 h-20 w-32 rounded-sm border border-white/18 bg-white/8" />
          <div className="absolute bottom-8 left-8 right-8 border-t border-white/25 pt-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone === "dark" ? "text-white/72" : "text-slate-600"}`}>
              {typeLabel} · Verifika2
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
      ) : null}
      {photoSrc ? (
        // CRM photos can be absolute URLs or protected upload paths, so use a plain img instead of Next Image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoSrc}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${showPhoto ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.56))]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-white/70 backdrop-blur">
        <Image src="/brand/verifika2_mark.svg" alt="" width={16} height={16} />
        <span>{label || "Verificado"}</span>
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
        <div className="rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-white/70 backdrop-blur">
          {showPhoto ? "Galería disponible" : "Dossier visual pendiente"}
        </div>
        <div className="rounded-full bg-[#0B1D33]/92 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur">
          Documentación revisada
        </div>
      </div>
    </div>
  );
}
