import { NextResponse, type NextRequest } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { assertOwnerAuth } from "@/lib/ownerAuth";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: NextRequest, context: { params: Promise<{ leadId: string }> }) {
  try {
    assertOwnerAuth(request);
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { leadId } = await context.params;
  const form = await request.formData();
  const status = normalize(form.get("status"));
  const scheduledAt = normalize(form.get("scheduled_at"));
  const outcome = normalize(form.get("outcome"));
  const outcomeNote = normalize(form.get("outcome_note"));
  const returnTo = normalize(form.get("return_to")) || "/owner";

  const payload: Record<string, string> = { status };
  if (scheduledAt) {
    // datetime-local returns "YYYY-MM-DDTHH:mm"
    payload.scheduled_at = scheduledAt;
  }
  if (outcome) payload.outcome = outcome;
  if (outcomeNote) payload.outcome_note = outcomeNote;

  const res = await leadHubFetch(`/v1/leads/${encodeURIComponent(leadId)}/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json({ ok: false, error: "hub_failed", details: data }, { status: 502 });
  }

  return NextResponse.redirect(new URL(returnTo, request.url), 303);
}

