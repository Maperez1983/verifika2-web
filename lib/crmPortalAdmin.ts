const DEFAULT_ORIGIN = "https://crm.verifika2.com";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function crmOrigin() {
  const raw = normalize(process.env.CRM_PORTAL_ORIGIN || process.env.CRM_ORIGIN);
  if (!raw) return DEFAULT_ORIGIN;
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_ORIGIN;
  }
}

function crmAdminToken() {
  return normalize(process.env.CRM_PORTAL_ADMIN_TOKEN || process.env.CRM_ADMIN_TOKEN);
}

export async function setPortalPublished(listingId: string, published: boolean) {
  const origin = crmOrigin();
  const token = crmAdminToken();
  if (!token) throw new Error("crm_admin_token_missing");

  const url = new URL("/api/portal_publish_update", origin);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      listing_id: listingId,
      published: published ? 1 : 0,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`crm_failed:${res.status}:${body.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => null);
  if (!data || data.ok !== true) throw new Error("crm_failed");
  return true;
}

