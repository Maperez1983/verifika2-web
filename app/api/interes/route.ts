import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";
import { fetchPortalListing } from "@/lib/crmPortal";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function pickIntent(tipo: string) {
  const t = normalize(tipo).toLowerCase();
  if (t === "visita") return "visita";
  if (t === "contacto") return "contacto";
  return "info";
}

function buildNote(parts: Array<string | null | undefined>) {
  const clean = (parts || [])
    .map((p) => normalize(p))
    .filter(Boolean);
  return clean.length ? clean.join("\n") : undefined;
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const listingId = normalize(form.get("listing"));
  const tipo = normalize(form.get("tipo")) || "info";
  const intent = pickIntent(tipo);

  const name = normalize(form.get("nombre")) || undefined;
  const email = normalize(form.get("email")) || "";
  const phone = normalize(form.get("telefono")) || "";
  const message = normalize(form.get("mensaje")) || "";
  const consent = normalize(form.get("consent"));

  const contact = email || phone;
  const next = sanitizeRelativePath(form.get("next"), "/inmuebles");

  if (!contact) {
    const url = new URL("/interes", origin);
    if (listingId) url.searchParams.set("listing", listingId);
    url.searchParams.set("tipo", tipo);
    url.searchParams.set("error", "missing_contact");
    return NextResponse.redirect(url, 302);
  }

  if (consent !== "1") {
    const url = new URL("/interes", origin);
    if (listingId) url.searchParams.set("listing", listingId);
    url.searchParams.set("tipo", tipo);
    url.searchParams.set("error", "missing_consent");
    return NextResponse.redirect(url, 302);
  }

  let listing: Awaited<ReturnType<typeof fetchPortalListing>> | null = null;
  try {
    if (listingId) listing = await fetchPortalListing(listingId);
  } catch {
    listing = null;
  }
  const note = buildNote([
    phone ? `Teléfono: ${phone}` : null,
    message ? `Mensaje: ${message}` : null,
  ]);

  const payload = {
    persona: "comprador",
    intent,
    name,
    contact,
    note,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          city: listing.city,
          operation: listing.operation,
          verifiedAt: listing.verifiedAt,
          certified: listing.certified,
        }
      : listingId
          ? { id: listingId }
          : undefined,
    source: {
      path: new URL(request.url).pathname,
      href: request.headers.get("referer") ?? "",
    },
  };

  try {
    const res = await leadHubFetch("/v1/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const url = new URL("/interes", origin);
      if (listingId) url.searchParams.set("listing", listingId);
      url.searchParams.set("tipo", tipo);
      url.searchParams.set("error", "hub_failed");
      if (body) url.searchParams.set("detail", body.slice(0, 120));
      return NextResponse.redirect(url, 302);
    }
  } catch (error) {
    const url = new URL("/interes", origin);
    if (listingId) url.searchParams.set("listing", listingId);
    url.searchParams.set("tipo", tipo);
    url.searchParams.set("error", "hub_not_configured");
    url.searchParams.set("detail", String(error).slice(0, 120));
    return NextResponse.redirect(url, 302);
  }

  const okUrl = new URL("/interes", origin);
  if (listingId) okUrl.searchParams.set("listing", listingId);
  okUrl.searchParams.set("tipo", tipo);
  okUrl.searchParams.set("sent", "1");
  okUrl.searchParams.set("next", next);
  return NextResponse.redirect(okUrl, 302);
}
