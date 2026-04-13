import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const debugEnabled =
    process.env.DEBUG_ENDPOINTS === "1" || process.env.NODE_ENV !== "production";
  if (!debugEnabled) {
    return new NextResponse(null, { status: 404 });
  }

  const password = process.env.PORTAL_PASSWORD ?? "";
  const secret = process.env.PORTAL_AUTH_SECRET ?? "";

  return NextResponse.json({
    ok: true,
    hasPassword: Boolean(password),
    passwordLength: password.length,
    passwordHasWhitespace: password !== password.trim(),
    hasSecret: Boolean(secret),
    secretLength: secret.length,
    secretHasWhitespace: secret !== secret.trim(),
  });
}
