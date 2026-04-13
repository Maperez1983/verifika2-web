import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";

const AUTH_COOKIE = "v2_portal_auth";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_NEXT = "/inmuebles";

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

function normalizePasswordInput(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    // Common invisible characters when copy/pasting from chat apps.
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    .trim();
}

export async function POST(request: Request) {
  const password = process.env.PORTAL_PASSWORD ?? "";
  const secret = process.env.PORTAL_AUTH_SECRET ?? "";
  const origin = publicOrigin(request);

  const form = await request.formData();
  const submitted = normalizePasswordInput(form.get("password"));
  const expected = normalizePasswordInput(password);
  const next = sanitizeRelativePath(form.get("next"), DEFAULT_NEXT);

  if (!password || !secret) {
    const url = new URL("/acceso", origin);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  if (!safeEqual(submitted, expected)) {
    const url = new URL("/acceso", origin);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  const expires = Math.floor(Date.now() / 1000) + DEFAULT_TTL_SECONDS;
  const token = signToken(expires, secret);
  const secure = process.env.NODE_ENV === "production";

  const redirectTo = new URL(next, origin);
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
  const origin = publicOrigin(request);
  const response = NextResponse.redirect(new URL("/", origin), 302);
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
