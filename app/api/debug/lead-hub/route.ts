import { NextResponse } from "next/server";
import { getLeadHubConfig, leadHubFetch } from "@/lib/leadHub";

export async function GET() {
  const cfg = getLeadHubConfig();
  const env = {
    LEAD_HUB_URL: Boolean(process.env.LEAD_HUB_URL),
    LEAD_HUB_TOKEN: Boolean(process.env.LEAD_HUB_TOKEN),
    LEADS_WEBHOOK_URL: Boolean(process.env.LEADS_WEBHOOK_URL),
    LEADS_WEBHOOK_TOKEN: Boolean(process.env.LEADS_WEBHOOK_TOKEN),
  };

  if (!cfg) {
    return NextResponse.json({
      ok: false,
      error: "lead_hub_not_configured",
      env,
    });
  }

  let configStatus = null as null | number;
  let configBody: unknown = null;
  let configError: string | null = null;

  try {
    const res = await leadHubFetch("/v1/config");
    configStatus = res.status;
    configBody = await res.json().catch(() => null);
  } catch (error) {
    configError = String(error);
  }

  return NextResponse.json({
    ok: true,
    env,
    origin: cfg.origin,
    tokenLength: cfg.token.length,
    leadHubConfigStatus: configStatus,
    leadHubConfigBody: configBody,
    leadHubConfigError: configError,
  });
}

