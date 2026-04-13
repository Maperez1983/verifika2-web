import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

const DEFAULT_MILESTONES: Array<{ key: string; title: string }> = [
  { key: "reserva", title: "Reserva" },
  { key: "arras", title: "Firma de arras" },
  { key: "hipoteca", title: "Gestión de hipoteca (si aplica)" },
  { key: "notaria", title: "Firma en notaría" },
  { key: "llaves", title: "Entrega de llaves" },
];

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin?error=invalid_form", origin), 303);
  }

  const listingId = normalize(form.get("listing_id"));
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/admin");
  if (!listingId) {
    return NextResponse.redirect(new URL(`/admin?error=missing_listing_id`, origin), 303);
  }

  for (const item of DEFAULT_MILESTONES) {
    const res = await leadHubFetch("/v1/milestones", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        key: item.key,
        title: item.title,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const url = new URL(returnTo, origin);
      url.searchParams.set("error", `hub_failed:${String(data?.error ?? res.status)}`);
      return NextResponse.redirect(url, 303);
    }
  }

  return NextResponse.redirect(new URL(returnTo, origin), 303);
}

