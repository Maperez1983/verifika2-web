import { cookies } from "next/headers";
import { verifySession } from "@/lib/sessionToken";
import { OWNER_SESSION_COOKIE, type OwnerSession } from "@/lib/ownerAuth";

export async function getOwnerSession(): Promise<OwnerSession | null> {
  const secret = process.env.OWNER_SESSION_SECRET ?? "";
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(OWNER_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;
  const payload = verifySession(token, secret);
  if (!payload) return null;
  const ownerId = String(payload.ownerId ?? "").trim();
  const listingIds = Array.isArray(payload.listingIds)
    ? payload.listingIds.map((v) => String(v)).filter(Boolean)
    : [];
  if (!ownerId || listingIds.length === 0) return null;
  return { ownerId, listingIds };
}

