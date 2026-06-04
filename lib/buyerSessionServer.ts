import { cookies } from "next/headers";
import { verifySession } from "@/lib/sessionToken";
import { BUYER_SESSION_COOKIE, type BuyerSession } from "@/lib/buyerAuth";

export async function getBuyerSession(): Promise<BuyerSession | null> {
  const secret = process.env.BUYER_SESSION_SECRET || process.env.OWNER_SESSION_SECRET || "";
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(BUYER_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;
  const payload = verifySession(token, secret);
  if (!payload) return null;
  const buyerId = String(payload.buyerId ?? "").trim();
  const contact = String(payload.contact ?? "").trim().toLowerCase();
  if (!buyerId || !contact) return null;
  return { buyerId, contact };
}
