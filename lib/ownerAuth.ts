import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const OWNER_AUTH_COOKIE = "v2_owner_auth";

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

export function assertOwnerAuth(request: NextRequest) {
  const password = process.env.OWNER_PORTAL_PASSWORD ?? "";
  const secret = process.env.OWNER_PORTAL_AUTH_SECRET ?? "";
  if (!password || !secret) return;

  const token = request.cookies.get(OWNER_AUTH_COOKIE)?.value ?? "";
  if (!token || !verifyToken(token, secret)) {
    throw new Error("owner_unauthorized");
  }
}

