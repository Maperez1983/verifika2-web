import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/http";
import { leadHubFetch } from "@/lib/leadHub";

const ALLOWED_SERVICES = new Set([
  "purchase_tracking",
  "document_verification_basic",
  "document_verification_full",
]);

const ALLOWED_STATUSES = new Set([
  "requested",
  "active",
  "in_review",
  "delivered",
  "paused",
  "cancelled",
]);

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function sanitizeRelativePath(value: unknown, fallback: string) {
  const path = normalize(value);
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin?error=invalid_form", origin), 303);
  }

  const returnTo = sanitizeRelativePath(form.get("return_to"), "/admin");
  const listingId = normalize(form.get("listing_id"));
  const subjectType = normalize(form.get("subject_type"));
  const subjectContact = normalize(form.get("subject_contact")).toLowerCase();
  const subjectId = normalize(form.get("subject_id"));
  const service = normalize(form.get("service"));
  const status = normalize(form.get("status")) || "active";
  const note = normalize(form.get("note"));
  const actor = normalize(form.get("actor")) || "admin";

  if (
    !listingId ||
    !ALLOWED_SERVICES.has(service) ||
    !ALLOWED_STATUSES.has(status) ||
    !["buyer", "owner"].includes(subjectType) ||
    (!subjectContact && !subjectId)
  ) {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", "missing_service_fields");
    return NextResponse.redirect(url, 303);
  }

  try {
    const res = await leadHubFetch("/v1/operation_services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        subject_type: subjectType,
        subject_contact: subjectContact || undefined,
        subject_id: subjectId || undefined,
        service,
        status,
        note: note || undefined,
        actor,
      }),
    });
    const data = await res.json().catch(() => null);
    const url = new URL(returnTo, origin);
    if (!res.ok || !data?.ok) {
      url.searchParams.set("error", String(data?.error || "hub_failed"));
      return NextResponse.redirect(url, 303);
    }
    url.searchParams.set("ok", "1");
    return NextResponse.redirect(url, 303);
  } catch (error) {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", String(error).slice(0, 120));
    return NextResponse.redirect(url, 303);
  }
}
