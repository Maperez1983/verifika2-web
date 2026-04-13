import { NextResponse } from "next/server";
import { leadHubFetch } from "@/lib/leadHub";
import { signSession } from "@/lib/sessionToken";
import { OWNER_SESSION_COOKIE } from "@/lib/ownerAuth";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_NEXT = "/owner";

function sanitizeNextPath(value: unknown, fallback: string) {
  const next = String(value ?? "").trim();
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  // Prevent scheme-relative redirects like //localhost:3000/...
  if (next.startsWith("//")) return fallback;
  if (next.includes("\\")) return fallback;
  return next;
}

export async function POST(request: Request) {
  const sessionSecret = process.env.OWNER_SESSION_SECRET ?? "";

  const form = await request.formData();
  const code = String(form.get("code") ?? "").trim();
  const next = sanitizeNextPath(form.get("next"), DEFAULT_NEXT);

  if (!sessionSecret) {
    const url = new URL("/owner/acceso", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  if (!code) {
    const url = new URL("/owner/acceso", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  let owner: { id: string; listing_ids: unknown } | null = null;
  try {
    const res = await leadHubFetch("/v1/owners/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) owner = null;
    else {
      const data = await res.json().catch(() => null);
      owner = data?.owner ? (data.owner as { id: string; listing_ids: unknown }) : null;
    }
  } catch {
    owner = null;
  }

  const ownerId = owner?.id ? String(owner.id) : "";
  const listingIds = Array.isArray(owner?.listing_ids)
    ? owner!.listing_ids.map((v) => String(v)).filter(Boolean)
    : [];

  if (!ownerId || listingIds.length === 0) {
    const url = new URL("/owner/acceso", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  const token = signSession(
    {
      ownerId,
      listingIds,
    },
    sessionSecret,
    DEFAULT_TTL_SECONDS,
  );
  const secure = process.env.NODE_ENV === "production";

  const redirectTo = new URL(next, request.url);
  const response = NextResponse.redirect(redirectTo, 302);
  response.cookies.set({
    name: OWNER_SESSION_COOKIE,
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
  const redirectTo = new URL("/propietarios", request.url);
  const response = NextResponse.redirect(redirectTo, 302);
  response.cookies.set({
    name: OWNER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  return response;
}
