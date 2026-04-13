import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin/leads?error=invalid_form", origin), 303);
  }

  const leadId = normalize(form.get("lead_id"));
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/admin/leads");

  if (!leadId) {
    return NextResponse.redirect(new URL("/admin/leads?error=missing_lead_id", origin), 303);
  }

  try {
    const res = await leadHubFetch(`/v1/leads/${encodeURIComponent(leadId)}/retry_crm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const reason = data?.error ? String(data.error) : "hub_failed";
      return NextResponse.redirect(
        new URL(`/admin/leads?error=${encodeURIComponent(reason)}`, origin),
        303,
      );
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/admin/leads?error=${encodeURIComponent(String(error).slice(0, 120))}`, origin),
      303,
    );
  }

  const url = new URL(returnTo, origin);
  url.searchParams.set("retried", "1");
  return NextResponse.redirect(url, 303);
}

