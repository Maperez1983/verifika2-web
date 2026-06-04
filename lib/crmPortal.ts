import type { Listing } from "@/lib/listings";

const DEFAULT_ORIGIN = "https://crm.verifika2.com";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeOperation(value: unknown): Listing["operation"] {
  const raw = normalize(value).toLowerCase();
  if (["alquiler", "arrendamiento", "renta"].includes(raw)) return "alquiler";
  return "venta";
}

function normalizePropertyType(value: unknown): Listing["propertyType"] {
  const raw = normalize(value).toLowerCase();
  if (raw.includes("ático") || raw.includes("atico")) return "ático";
  if (raw.includes("casa") || raw.includes("chalet") || raw.includes("villa")) return "casa";
  if (raw.includes("local")) return "local";
  return "piso";
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = normalize(value)
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = normalize(value).replace(",", ".");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPrice(value: unknown, operation: Listing["operation"]) {
  const amount = numberValue(value);
  if (amount <= 0) return "Consultar";
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
  return operation === "alquiler" ? `${formatted}/mes` : formatted;
}

function firstText(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = normalize(source[key]);
    if (value) return value;
  }
  return "";
}

function absoluteCrmUrl(value: unknown) {
  const raw = normalize(value);
  if (!raw) return "";
  try {
    return new URL(raw).toString();
  } catch {
    return new URL(raw.startsWith("/") ? raw : `/${raw}`, crmOrigin()).toString();
  }
}

function buildDetails(source: Record<string, unknown>) {
  const details: string[] = [];
  const m2 = numberValue(source.m2);
  const rooms = numberValue(source.habitaciones);
  const baths = numberValue(source.banos);
  const zone = firstText(source, ["zona"]);
  const subtype = firstText(source, ["subtipologia"]);

  if (rooms > 0) details.push(`${rooms} ${rooms === 1 ? "habitación" : "habitaciones"}`);
  if (baths > 0) details.push(`${baths} ${baths === 1 ? "baño" : "baños"}`);
  if (m2 > 0) details.push(`${m2} m²`);
  if (subtype) details.push(subtype);
  if (zone) details.push(zone);

  return details;
}

function buildCommercialDescription(source: Record<string, unknown>, fallback: string, operation: Listing["operation"], propertyType: Listing["propertyType"]) {
  if (fallback) return fallback;
  const city = firstText(source, ["poblacion", "localidad", "ciudad", "provincia", "zona"]);
  const zone = firstText(source, ["zona"]);
  const location = [zone, city].filter(Boolean).join(", ") || "la zona";
  const details = buildDetails(source);
  const op = operation === "alquiler" ? "alquiler" : "venta";
  if (propertyType === "local") {
    return `Local comercial en ${location}, disponible en ${op}. Publicación revisada con información clara para valorar ubicación, superficie y condiciones antes de concertar visita.`;
  }
  if (operation === "alquiler") {
    return `Vivienda en ${location}, disponible en alquiler. Revisa sus características principales y solicita visita para confirmar condiciones, disponibilidad y documentación.`;
  }
  return `Inmueble en ${location}, disponible en venta. Ficha revisada para consultar precio, características y estado antes de avanzar con la operación. ${details.length ? `Destaca por: ${details.slice(0, 3).join(", ")}.` : ""}`;
}

function parsePhotos(source: Record<string, unknown>) {
  const candidates = [
    source.fotos,
    source.photos,
    source.galeria,
    source.gallery,
    source.foto,
    source.photo,
  ];
  const out: string[] = [];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const url = typeof item === "object" && item ? (item as Record<string, unknown>).url : item;
        const absolute = absoluteCrmUrl(url);
        if (absolute && !out.includes(absolute)) out.push(absolute);
      }
    } else {
      const raw = normalize(candidate);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const url = typeof item === "object" && item ? (item as Record<string, unknown>).url : item;
            const absolute = absoluteCrmUrl(url);
            if (absolute && !out.includes(absolute)) out.push(absolute);
          }
          continue;
        }
      } catch {
        // Not JSON: handle as a single URL.
      }
      const absolute = absoluteCrmUrl(raw);
      if (absolute && !out.includes(absolute)) out.push(absolute);
    }
  }
  return out.slice(0, 12);
}

function mapCrmListing(raw: unknown): Listing | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  const id = normalize(source.id);
  if (!id) return null;

  const operation = normalizeOperation(source.tipo_operacion ?? source.operation);
  const propertyType = normalizePropertyType(source.tipo_inmueble ?? source.propertyType);
  const city = firstText(source, ["poblacion", "localidad", "ciudad", "city", "provincia", "zona"]);
  const zone = firstText(source, ["zona"]);
  const province = firstText(source, ["provincia"]);
  const details = buildDetails(source);
  const price = source.precio ?? source.priceValue ?? source.precio_encargo ?? source.precio_objetivo;
  const title =
    firstText(source, ["titulo_anuncio", "titulo", "title", "direccion", "referencia"]) ||
    "Inmueble Verifika2";
  const crmDescription = firstText(source, ["descripcion_larga", "descripcion_corta", "descripcion", "description"]);
  const description = buildCommercialDescription(source, crmDescription, operation, propertyType);
  const photos = parsePhotos(source);
  const lat = optionalNumber(source.lat);
  const lon = optionalNumber(source.lon);

  return {
    id,
    title,
    city: city || "Ubicación disponible bajo solicitud",
    operation,
    propertyType,
    priceLabel: firstText(source, ["priceLabel"]) || formatPrice(price, operation),
    priceValue: numberValue(price),
    detailsShort: details.length ? details.slice(0, 4).join(" · ") : "Información disponible bajo solicitud",
    details: details.length ? details : ["Inmueble verificado", operation === "alquiler" ? "Alquiler" : "Venta"],
    description,
    verifiedAt: firstText(source, ["publicado_at", "verifiedAt"]) || "Verificado",
    certified: Boolean(Number(source.certificado ?? source.certified ?? 0)),
    published: source.publicado_at ? true : source.published !== false,
    photo: photos[0] || null,
    photos,
    agencyName: "Grupo Modernia",
    agencyLogo: "/brand/grupo_modernia_logo.png",
    address: firstText(source, ["direccion", "address"]),
    zone,
    province,
    lat,
    lon,
    seoSlug: firstText(source, ["seo_slug", "slug"]) || id,
    verificationChecks: [
      { label: "Anunciante identificado", status: "ok" },
      { label: "Datos básicos revisados", status: "ok" },
      { label: "Estado comercial actualizado", status: "ok" },
      { label: "Documentación disponible bajo solicitud", status: "review" },
    ],
  };
}

function crmOrigin() {
  const raw = normalize(process.env.CRM_PORTAL_ORIGIN || process.env.CRM_ORIGIN);
  if (!raw) return DEFAULT_ORIGIN;
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_ORIGIN;
  }
}

export async function fetchPortalListings(options?: {
  q?: string;
  operacion?: "venta" | "alquiler" | "";
  ciudad?: string;
  certificado?: boolean;
  limit?: number;
}): Promise<Listing[]> {
  const origin = crmOrigin();
  const url = new URL("/api/portal_inmuebles", origin);
  if (options?.q) url.searchParams.set("q", options.q);
  if (options?.operacion) url.searchParams.set("operacion", options.operacion);
  if (options?.ciudad) url.searchParams.set("ciudad", options.ciudad);
  if (options?.certificado) url.searchParams.set("certificado", "1");
  if (options?.limit) url.searchParams.set("limit", String(options.limit));

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as unknown;
  if (!data || typeof data !== "object") return [];
  const listings = (data as Record<string, unknown>).listings;
  const rows = Array.isArray(listings)
    ? listings
    : Array.isArray((data as Record<string, unknown>).rows)
      ? ((data as Record<string, unknown>).rows as unknown[])
      : [];
  return rows.map(mapCrmListing).filter((listing): listing is Listing => Boolean(listing));
}

export async function fetchPortalListing(id: string): Promise<Listing | null> {
  const origin = crmOrigin();
  const url = new URL("/api/portal_inmueble", origin);
  url.searchParams.set("id", id);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  if (!data || typeof data !== "object") return null;
  const listing = (data as Record<string, unknown>).listing;
  const row = listing || (data as Record<string, unknown>).row;
  return mapCrmListing(row);
}
