import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

const DEFAULT_DOCUMENTS: Array<{ title: string }> = [
  { title: "Nota simple / titularidad" },
  { title: "Certificado energético" },
  { title: "Recibo IBI" },
  { title: "Certificado de comunidad (deudas)" },
  { title: "Escrituras (si aplica)" },
  { title: "DNI/NIE propietarios" },
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

  for (const doc of DEFAULT_DOCUMENTS) {
    const res = await leadHubFetch("/v1/documents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        title: doc.title,
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

