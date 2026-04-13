import type { NextRequest } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/sessionToken";

export const OWNER_SESSION_COOKIE = "v2_owner_session";

export type OwnerSession = {
  ownerId: string;
  listingIds: string[];
};

function payloadToOwnerSession(payload: SessionPayload | null): OwnerSession | null {
  if (!payload) return null;
  const ownerId = String(payload.ownerId ?? "").trim();
  const listingIds = Array.isArray(payload.listingIds)
    ? payload.listingIds.map((v) => String(v)).filter(Boolean)
    : [];
  if (!ownerId || listingIds.length === 0) return null;
  return { ownerId, listingIds };
}

export function getOwnerSessionFromRequest(request: NextRequest): OwnerSession | null {
  const secret = process.env.OWNER_SESSION_SECRET ?? "";
  if (!secret) return null;
  const token = request.cookies.get(OWNER_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;
  return payloadToOwnerSession(verifySession(token, secret));
}

export function assertOwnerAuth(request: NextRequest): OwnerSession {
  const session = getOwnerSessionFromRequest(request);
  if (!session) throw new Error("owner_unauthorized");
  return session;
}
