import type { Listing } from "@/lib/listings";

const DEFAULT_ORIGIN = "https://crm.verifika2.com";

function normalize(value: unknown) {
  return String(value ?? "").trim();
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
  return Array.isArray(listings) ? (listings as Listing[]) : [];
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
  if (!listing || typeof listing !== "object") return null;
  return listing as Listing;
}

