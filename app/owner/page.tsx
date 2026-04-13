import type { Metadata } from "next";
import Link from "next/link";
import { mockListings } from "@/lib/listings";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Owner Portal (beta)",
  description:
    "Área privada de propietario: métricas del anuncio, visitas, documentación y trazabilidad.",
};

export const dynamic = "force-dynamic";

type ListingSummary = {
  ok: boolean;
  metrics: { views: number; last_view_at: string | null };
  counts: { leads_total: number; leads_info: number; leads_visita: number };
};

type HubConfig = {
  ok: boolean;
  hubConfigured: boolean;
  slackConfigured: boolean;
  databaseConfigured: boolean;
  crmConfigured: boolean;
};

async function getSummary(listingId: string): Promise<ListingSummary | null> {
  try {
    const res = await leadHubFetch(`/v1/metrics?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return null;
    return (await res.json()) as ListingSummary;
  } catch {
    return null;
  }
}

async function getHubConfig(): Promise<HubConfig | null> {
  try {
    const res = await leadHubFetch("/v1/config");
    if (!res.ok) return null;
    return (await res.json()) as HubConfig;
  } catch {
    return null;
  }
}

export default async function OwnerDashboard() {
  const listings = mockListings.slice(0, 6);
  const hubConfig = await getHubConfig();
  const summaries = await Promise.all(listings.map((l) => getSummary(l.id)));
  const anySummaryOk = summaries.some(Boolean);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Owner Portal (beta)
            </p>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">
              Seguimiento del inmueble
            </h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Métricas del anuncio, solicitudes (info/visita), documentación y
              trazabilidad. En la siguiente fase se conectará con el CRM y la
              firma digital.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Landing
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Ver portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {!anySummaryOk ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pueden cargar las métricas.</p>
            <p className="pt-2 leading-6">
              Revisa que `verifika2-web` tenga configurado el acceso al Lead Hub
              (variables `LEADS_WEBHOOK_URL`/`LEADS_WEBHOOK_TOKEN` o `LEAD_HUB_URL`/`LEAD_HUB_TOKEN`).
            </p>
            {hubConfig ? (
              <p className="pt-2 text-xs text-amber-900/80">
                Hub: {hubConfig.hubConfigured ? "OK" : "KO"} · DB:{" "}
                {hubConfig.databaseConfigured ? "OK" : "KO"} · Slack:{" "}
                {hubConfig.slackConfigured ? "OK" : "KO"}
              </p>
            ) : (
              <p className="pt-2 text-xs text-amber-900/80">
                No se puede leer `/v1/config` desde este servicio.
              </p>
            )}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => {
            const summary = summaries[index];
            const views = summary?.metrics?.views ?? 0;
            const leads = summary?.counts?.leads_total ?? 0;
            const visits = summary?.counts?.leads_visita ?? 0;
            return (
              <Link
                key={listing.id}
                href={`/owner/inmuebles/${encodeURIComponent(listing.id)}`}
                className="group rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">
                      {listing.title}
                    </p>
                    <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    Verificado
                  </div>
                </div>
                <div className="pt-5 grid gap-2 text-sm text-slate-700">
                  <Row label="Vistas" value={String(views)} />
                  <Row label="Solicitudes" value={String(leads)} />
                  <Row label="Visitas" value={String(visits)} />
                </div>
                <p className="pt-5 text-sm font-medium text-[color:var(--foreground)] group-hover:underline">
                  Abrir seguimiento
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-[color:var(--foreground)]">
        {value}
      </span>
    </div>
  );
}
