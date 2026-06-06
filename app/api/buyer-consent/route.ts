import { NextRequest, NextResponse } from "next/server";
import { assertBuyerAuth } from "@/lib/buyerAuth";
import { publicOrigin, sanitizeRelativePath } from "@/lib/http";
import { leadHubFetch } from "@/lib/leadHub";
import {
  consentSubjectForBuyer,
  PRIVACY_CONSENT_VERSION,
} from "@/lib/privacyConsent";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: NextRequest) {
  const origin = publicOrigin(request);
  const form = await request.formData();
  const next = sanitizeRelativePath(form.get("next"), "/comprador");

  let session;
  try {
    session = assertBuyerAuth(request);
  } catch {
    const url = new URL("/comprador/acceso", origin);
    url.searchParams.set("next", "/comprador/tratamiento-datos");
    return NextResponse.redirect(url, 302);
  }

  const signerName = normalize(form.get("signer_name"));
  const signerIdDoc = normalize(form.get("signer_id_doc"));
  const signatureText = normalize(form.get("signature_text"));
  const acceptedPrivacy = form.get("accepted_privacy") === "1";
  const acceptedOperations = form.get("accepted_operations") === "1";
  const acceptedRights = form.get("accepted_rights") === "1";
  const acceptedMarketing = form.get("accepted_marketing") === "1";

  if (!signerName || !signatureText || !acceptedPrivacy || !acceptedOperations || !acceptedRights) {
    const url = new URL("/comprador/tratamiento-datos", origin);
    url.searchParams.set("error", "missing");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  try {
    const res = await leadHubFetch("/v1/consents", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
        "user-agent": request.headers.get("user-agent") || "",
      },
      body: JSON.stringify({
        persona: "comprador",
        subject_id: consentSubjectForBuyer(session),
        contact: session.contact,
        name: signerName,
        version: PRIVACY_CONSENT_VERSION,
        accepted_privacy: acceptedPrivacy,
        accepted_operations: acceptedOperations,
        accepted_rights: acceptedRights,
        accepted_marketing: acceptedMarketing,
        signer_name: signerName,
        signer_id_doc: signerIdDoc,
        signature_text: signatureText,
        source_path: "/comprador/tratamiento-datos",
        payload: {
          area: "buyer",
          consent_version: PRIVACY_CONSENT_VERSION,
        },
      }),
    });
    if (!res.ok) throw new Error("hub_failed");
  } catch {
    const url = new URL("/comprador/tratamiento-datos", origin);
    url.searchParams.set("error", "hub");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.redirect(new URL(next, origin), 302);
}
