import { NextResponse } from "next/server";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";
import { leadHubFetch } from "@/lib/leadHub";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);
  const form = await request.formData();
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/admin/operations");
  const confirm = normalize(form.get("confirm"));

  if (confirm !== "ARCHIVE_QA") {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", "missing_confirmation");
    return NextResponse.redirect(url, 303);
  }

  try {
    const res = await leadHubFetch("/v1/qa/archive", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ confirm, actor: "admin" }),
    });
    const data = await res.json().catch(() => null);
    const url = new URL(returnTo, origin);
    if (!res.ok || !data?.ok) {
      url.searchParams.set("error", String(data?.error || "hub_failed"));
      return NextResponse.redirect(url, 303);
    }
    url.searchParams.set("qa_archived", "1");
    url.searchParams.set("services", String(data.archived?.operation_services ?? 0));
    url.searchParams.set("buyers", String(data.archived?.buyers ?? 0));
    url.searchParams.set("owners", String(data.archived?.owners ?? 0));
    url.searchParams.set("leads", String(data.archived?.leads ?? 0));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", String(error).slice(0, 120));
    return NextResponse.redirect(url, 303);
  }
}
