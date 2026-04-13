type LeadHubConfig = {
  origin: string;
  token: string;
};

export function getLeadHubConfig(): LeadHubConfig | null {
  const token =
    process.env.LEAD_HUB_TOKEN ||
    process.env.LEADS_WEBHOOK_TOKEN;

  const url =
    process.env.LEAD_HUB_URL ||
    process.env.LEADS_WEBHOOK_URL;

  if (!token || !url) return null;

  try {
    const parsed = new URL(url);
    const origin = parsed.origin;
    return { origin, token };
  } catch {
    return null;
  }
}

export async function leadHubFetch(path: string, init?: RequestInit) {
  const cfg = getLeadHubConfig();
  if (!cfg) throw new Error("lead_hub_not_configured");

  const url = new URL(path, cfg.origin);
  const headers = new Headers(init?.headers);
  headers.set("authorization", `Bearer ${cfg.token}`);
  return fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
}
