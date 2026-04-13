import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "v2_owner_auth";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

function base64url(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

function signToken(expiresAtEpochSeconds: number, secret: string) {
  const payload = base64url(String(expiresAtEpochSeconds));
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function safeEqual(a: string, b: string) {
  try {
    const aa = Buffer.from(a);
    const bb = Buffer.from(b);
    if (aa.length !== bb.length) return false;
    return timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const password = process.env.OWNER_PORTAL_PASSWORD ?? "";
  const secret = process.env.OWNER_PORTAL_AUTH_SECRET ?? "";

  const form = await request.formData();
  const submitted = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/owner") || "/owner";

  if (!password || !secret) {
    const url = new URL("/owner/acceso", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  if (!safeEqual(submitted, password)) {
    const url = new URL("/owner/acceso", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  const expires = Math.floor(Date.now() / 1000) + DEFAULT_TTL_SECONDS;
  const token = signToken(expires, secret);
  const secure = process.env.NODE_ENV === "production";

  const redirectTo = new URL(next.startsWith("/") ? next : "/owner", request.url);
  const response = NextResponse.redirect(redirectTo, 302);
  response.cookies.set({
    name: AUTH_COOKIE,
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
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  return response;
}

