import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { signSession } from "@/lib/sessionToken";
import { BUYER_SESSION_COOKIE } from "@/lib/buyerAuth";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";
import { consentSubjectForBuyer, hasPrivacyConsent } from "@/lib/privacyConsent";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_NEXT = "/comprador";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const sessionSecret = process.env.BUYER_SESSION_SECRET || process.env.OWNER_SESSION_SECRET || "";
  const origin = publicOrigin(request);
  const form = await request.formData();
  const contact = normalize(form.get("contact")).toLowerCase();
  const code = normalize(form.get("code"));
  const next = sanitizeRelativePath(form.get("next"), DEFAULT_NEXT);

  if (!sessionSecret || !contact || !code) {
    const url = new URL("/comprador/acceso", origin);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  let buyer: { id: string; contact: string } | null = null;
  try {
    const res = await leadHubFetch("/v1/buyers/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contact, code }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      buyer = data?.buyer ? (data.buyer as { id: string; contact: string }) : null;
    }
  } catch {
    buyer = null;
  }

  const buyerId = buyer?.id ? String(buyer.id) : "";
  const buyerContact = buyer?.contact ? String(buyer.contact).toLowerCase() : "";
  if (!buyerId || !buyerContact) {
    const url = new URL("/comprador/acceso", origin);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  const token = signSession({ buyerId, contact: buyerContact }, sessionSecret, DEFAULT_TTL_SECONDS);
  const secure = process.env.NODE_ENV === "production";
  const accepted = await hasPrivacyConsent("comprador", consentSubjectForBuyer({ buyerId, contact: buyerContact }));
  const redirectPath = accepted
    ? next
    : `/comprador/tratamiento-datos?next=${encodeURIComponent(next)}`;
  const response = NextResponse.redirect(new URL(redirectPath, origin), 302);
  response.cookies.set({
    name: BUYER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: DEFAULT_TTL_SECONDS,
  });
  return response;
}

export async function DELETE(request: Request) {
  const secure = process.env.NODE_ENV === "production";
  const origin = publicOrigin(request);
  const response = NextResponse.redirect(new URL("/inmuebles", origin), 302);
  response.cookies.set({
    name: BUYER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  return response;
}
