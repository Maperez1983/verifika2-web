import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const listingId =
    typeof body === "object" && body !== null && "listing_id" in body
      ? String((body as Record<string, unknown>).listing_id ?? "").trim()
      : "";
  if (!listingId) {
    return NextResponse.json({ ok: false, error: "missing_listing_id" }, { status: 400 });
  }

  try {
    const res = await leadHubFetch("/v1/events/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "hub_failed", details: data },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, metrics: data?.metrics ?? null });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "hub_not_configured", details: String(error) },
      { status: 500 },
    );
  }
}
