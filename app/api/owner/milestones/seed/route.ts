import { NextResponse, type NextRequest } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { assertOwnerAuth } from "@/lib/ownerAuth";
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

export async function POST(request: NextRequest) {
  let session;
  try {
    session = assertOwnerAuth(request);
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const listingId = normalize(form.get("listing_id"));
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/owner");
  const origin = publicOrigin(request);

  if (!listingId || !session.listingIds.includes(listingId)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
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
      return NextResponse.json(
        { ok: false, error: "hub_failed", details: data },
        { status: 502 },
      );
    }
  }

  return NextResponse.redirect(new URL(returnTo, origin), 303);
}

