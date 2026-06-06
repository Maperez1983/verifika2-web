import { leadHubFetch } from "@/lib/leadHub";
import type { BuyerSession } from "@/lib/buyerAuth";
import type { OwnerSession } from "@/lib/ownerAuth";

export const PRIVACY_CONSENT_VERSION = "rgpd-verifika2-v1-2026-06";

export type ConsentPersona = "comprador" | "propietario";

export function consentSubjectForBuyer(session: BuyerSession) {
  return session.buyerId || session.contact;
}

export function consentSubjectForOwner(session: OwnerSession) {
  return session.ownerId;
}

export function consentRedirect(path: "/comprador/tratamiento-datos" | "/owner/tratamiento-datos", next: string) {
  const params = new URLSearchParams();
  params.set("next", next);
  return `${path}?${params.toString()}`;
}

export async function hasPrivacyConsent(persona: ConsentPersona, subjectId: string) {
  if (!subjectId) return false;
  try {
    const url = new URL("/v1/consents/status", "http://local");
    url.searchParams.set("persona", persona);
    url.searchParams.set("subject_id", subjectId);
    url.searchParams.set("version", PRIVACY_CONSENT_VERSION);
    const res = await leadHubFetch(url.pathname + url.search);
    if (!res.ok) return false;
    const data = (await res.json()) as { accepted?: boolean };
    return Boolean(data.accepted);
  } catch {
    return false;
  }
}
