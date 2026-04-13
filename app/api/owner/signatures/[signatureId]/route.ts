import { NextResponse, type NextRequest } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { assertOwnerAuth } from "@/lib/ownerAuth";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ signatureId: string }> },
) {
  try {
    assertOwnerAuth(request);
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { signatureId } = await context.params;
  const form = await request.formData();
  const status = normalize(form.get("status"));
  const externalUrl = normalize(form.get("external_url"));
  const note = normalize(form.get("note"));
  const returnTo = normalize(form.get("return_to")) || "/owner";

  const res = await leadHubFetch(`/v1/signatures/${encodeURIComponent(signatureId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status, external_url: externalUrl, note }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json({ ok: false, error: "hub_failed", details: data }, { status: 502 });
  }

  return NextResponse.redirect(new URL(returnTo, request.url), 303);
}

