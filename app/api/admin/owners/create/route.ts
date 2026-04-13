import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { publicOrigin } from "@/lib/http";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function parseListingIds(raw: string) {
  const cleaned = normalize(raw);
  if (!cleaned) return [];
  return cleaned
    .split(/[\s,;\n\r\t]+/g)
    .map((v) => normalize(v))
    .filter(Boolean);
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin/owners?error=invalid_form", origin), 303);
  }

  const name = normalize(form.get("name"));
  const contact = normalize(form.get("contact"));
  const listingIds = [
    ...form
    .getAll("listing_ids")
    .map((v) => normalize(v))
    .filter(Boolean),
    ...parseListingIds(normalize(form.get("listing_ids_raw"))),
  ].filter(Boolean);

  if (listingIds.length === 0) {
    return NextResponse.redirect(new URL("/admin/owners?error=missing_listing_ids", origin), 303);
  }

  try {
    const res = await leadHubFetch("/v1/owners/create_code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name || undefined,
        contact: contact || undefined,
        listing_ids: listingIds,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !data?.code) {
      const reason = data?.error ? String(data.error) : "hub_failed";
      return NextResponse.redirect(new URL(`/admin/owners?error=${encodeURIComponent(reason)}`, origin), 303);
    }

    const url = new URL("/admin/owners", origin);
    url.searchParams.set("created", "1");
    url.searchParams.set("code", String(data.code));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/admin/owners?error=${encodeURIComponent(String(error).slice(0, 120))}`, origin),
      303,
    );
  }
}
