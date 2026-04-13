import { NextResponse, type NextRequest } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { assertOwnerAuth } from "@/lib/ownerAuth";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ docId: string }> },
) {
  try {
    assertOwnerAuth(request);
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { docId } = await context.params;
  const form = await request.formData();
  const status = normalize(form.get("status"));
  const note = normalize(form.get("note"));
  const returnTo = normalize(form.get("return_to")) || "/owner";

  const res = await leadHubFetch(`/v1/documents/${encodeURIComponent(docId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status, note }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json({ ok: false, error: "hub_failed", details: data }, { status: 502 });
  }

  return NextResponse.redirect(new URL(returnTo, request.url), 303);
}

