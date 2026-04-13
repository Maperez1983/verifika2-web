import { NextResponse, type NextRequest } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { assertOwnerAuth } from "@/lib/ownerAuth";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: NextRequest) {
  let session;
  try {
    session = assertOwnerAuth(request);
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const listingId = normalize(form.get("listing_id"));
  const title = normalize(form.get("title"));
  const note = normalize(form.get("note"));
  const provider = normalize(form.get("provider")) || "pending";
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/owner");
  const origin = publicOrigin(request);

  if (!listingId || !session.listingIds.includes(listingId)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const res = await leadHubFetch("/v1/signatures", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ listing_id: listingId, title, note, provider }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json({ ok: false, error: "hub_failed", details: data }, { status: 502 });
  }

  return NextResponse.redirect(new URL(returnTo, origin), 303);
}
