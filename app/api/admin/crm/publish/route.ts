import { NextResponse } from "next/server";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";
import { setPortalPublished } from "@/lib/crmPortalAdmin";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin?error=invalid_form", origin), 303);
  }

  const listingId = normalize(form.get("listing_id"));
  const publishedRaw = normalize(form.get("published"));
  const returnTo = sanitizeRelativePath(form.get("return_to"), "/admin");

  if (!listingId) {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", "missing_listing_id");
    return NextResponse.redirect(url, 303);
  }

  const published = publishedRaw === "1" || publishedRaw.toLowerCase() === "true";

  try {
    await setPortalPublished(listingId, published);
  } catch (error) {
    const url = new URL(returnTo, origin);
    url.searchParams.set("error", String(error).slice(0, 120));
    return NextResponse.redirect(url, 303);
  }

  const okUrl = new URL(returnTo, origin);
  okUrl.searchParams.set("ok", "1");
  return NextResponse.redirect(okUrl, 303);
}

