import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { verifySession } from "@/lib/sessionToken";

const AUTH_COOKIE = "v2_portal_auth";
const OWNER_SESSION_COOKIE = "v2_owner_session";

function fromBase64url(input: string) {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64").toString("utf8");
}

function verifyToken(token: string, secret: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const expiresRaw = fromBase64url(payload);
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires)) return false;
  const now = Math.floor(Date.now() / 1000);
  return expires > now;
}

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/brand")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/api/admin")) return false;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/acceso")) return true;
  if (pathname.startsWith("/verificacion")) return true;
  if (pathname.startsWith("/certificacion")) return true;
  if (pathname.startsWith("/profesionales")) return true;
  if (pathname.startsWith("/propietarios")) return true;
  return false;
}

function isProtectedPortalPath(pathname: string) {
  return (
    pathname.startsWith("/inmuebles") ||
    pathname.startsWith("/publicar") ||
    pathname.startsWith("/interes") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  );
}

function isProtectedOwnerPath(pathname: string) {
  return pathname === "/owner" || pathname.startsWith("/owner/");
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "verifika2.com") {
    const url = request.nextUrl.clone();
    url.host = "www.verifika2.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const portalPassword = process.env.PORTAL_PASSWORD;
  const portalSecret = process.env.PORTAL_AUTH_SECRET;
  const ownerSessionSecret = process.env.OWNER_SESSION_SECRET;

  const pathname = request.nextUrl.pathname;

  if (portalPassword && portalSecret && isProtectedPortalPath(pathname) && !isPublicPath(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token || !verifyToken(token, portalSecret)) {
      const url = request.nextUrl.clone();
      url.pathname = "/acceso";
      url.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(url, 302);
    }
  }

  if (ownerSessionSecret && isProtectedOwnerPath(pathname) && !pathname.startsWith("/owner/acceso")) {
    const token = request.cookies.get(OWNER_SESSION_COOKIE)?.value ?? "";
    const session = token ? verifySession(token, ownerSessionSecret) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/owner/acceso";
      url.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(url, 302);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
