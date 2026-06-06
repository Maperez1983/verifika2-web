import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/http";
import { leadHubFetch } from "@/lib/leadHub";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const origin = publicOrigin(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin/buyers?error=invalid_form", origin), 303);
  }

  const name = normalize(form.get("name"));
  const contact = normalize(form.get("contact")).toLowerCase();
  const services = form
    .getAll("services")
    .map((v) => normalize(v))
    .filter((v) => ["purchase_tracking", "document_verification_basic", "document_verification_full"].includes(v));

  if (!contact) {
    return NextResponse.redirect(new URL("/admin/buyers?error=missing_contact", origin), 303);
  }

  try {
    const res = await leadHubFetch("/v1/buyers/create_code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name || undefined,
        contact,
        services,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !data?.code) {
      const reason = data?.error ? String(data.error) : "hub_failed";
      return NextResponse.redirect(new URL(`/admin/buyers?error=${encodeURIComponent(reason)}`, origin), 303);
    }

    const url = new URL("/admin/buyers", origin);
    url.searchParams.set("created", "1");
    url.searchParams.set("code", String(data.code));
    url.searchParams.set("contact", contact);
    return NextResponse.redirect(url, 303);
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/admin/buyers?error=${encodeURIComponent(String(error).slice(0, 120))}`, origin),
      303,
    );
  }
}
