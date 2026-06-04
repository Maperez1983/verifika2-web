import type { NextRequest } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/sessionToken";

export const BUYER_SESSION_COOKIE = "v2_buyer_session";

export type BuyerSession = {
  buyerId: string;
  contact: string;
};

function payloadToBuyerSession(payload: SessionPayload | null): BuyerSession | null {
  if (!payload) return null;
  const buyerId = String(payload.buyerId ?? "").trim();
  const contact = String(payload.contact ?? "").trim().toLowerCase();
  if (!buyerId || !contact) return null;
  return { buyerId, contact };
}

export function getBuyerSessionFromRequest(request: NextRequest): BuyerSession | null {
  const secret = process.env.BUYER_SESSION_SECRET || process.env.OWNER_SESSION_SECRET || "";
  if (!secret) return null;
  const token = request.cookies.get(BUYER_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;
  return payloadToBuyerSession(verifySession(token, secret));
}

export function assertBuyerAuth(request: NextRequest): BuyerSession {
  const session = getBuyerSessionFromRequest(request);
  if (!session) throw new Error("buyer_unauthorized");
  return session;
}
