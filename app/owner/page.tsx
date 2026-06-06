import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListing } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";
import { getOwnerSession } from "@/lib/ownerSessionServer";
import { redirect } from "next/navigation";
import Sparkline from "@/components/charts/Sparkline";
import DeltaPill from "@/components/charts/DeltaPill";
import {
  consentRedirect,
  consentSubjectForOwner,
  hasPrivacyConsent,
} from "@/lib/privacyConsent";

export const metadata: Metadata = {
  title: "Portal de propietario",
  description:
    "Área privada de propietario: métricas del anuncio, visitas, documentación y trazabilidad.",
};

export const dynamic = "force-dynamic";

type ListingSummary = {
  ok: boolean;
  metrics: { views: number; last_view_at: string | null };
  counts: { leads_total: number; leads_info: number; leads_visita: number; leads_oferta?: number };
  timeseries?: { points: TimeseriesPoint[] };
};

type HubConfig = {
  ok: boolean;
  hubConfigured: boolean;
  slackConfigured: boolean;
  databaseConfigured: boolean;
  crmConfigured: boolean;
};

type TimeseriesPoint = {
  day: string;
  views: number;
  leads: number;
  visits: number;
  info: number;
  offers?: number;
};

async function getSummary(listingId: string): Promise<ListingSummary | null> {
  try {
    const res = await leadHubFetch(`/v1/metrics?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return null;
    const base = (await res.json()) as ListingSummary;
    try {
      const ts = await leadHubFetch(
        `/v1/metrics/timeseries?listing_id=${encodeURIComponent(listingId)}&days=14`,
      );
      if (ts.ok) {
        const data = (await ts.json()) as { points?: TimeseriesPoint[] };
        if (Array.isArray(data?.points)) base.timeseries = { points: data.points };
      }
    } catch {}
    return base;
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
  const session = await getOwnerSession();
  if (!session) redirect("/owner/acceso");
  const accepted = await hasPrivacyConsent("propietario", consentSubjectForOwner(session));
  if (!accepted) redirect(consentRedirect("/owner/tratamiento-datos", "/owner"));

  const listings = (
    await Promise.all(session.listingIds.map((id) => fetchPortalListing(id).catch(() => null)))
  ).filter(Boolean) as Array<NonNullable<Awaited<ReturnType<typeof fetchPortalListing>>>>;
  const hubConfig = await getHubConfig();
  const summaries = await Promise.all(listings.map((l) => getSummary(l.id)));
  const anySummaryOk = summaries.some(Boolean);
  const totals = summaries.reduce(
    (acc, summary) => {
      acc.views += summary?.metrics?.views ?? 0;
      acc.leads += summary?.counts?.leads_total ?? 0;
      acc.visits += summary?.counts?.leads_visita ?? 0;
      acc.offers += summary?.counts?.leads_oferta ?? 0;
      return acc;
    },
    { views: 0, leads: 0, visits: 0, offers: 0 },
  );

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Portal de propietario
            </p>
            <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
              Control comercial y documental de tus inmuebles
            </h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Métricas del anuncio, clientes interesados, citas, ofertas, documentación y próximos pasos de cada operación.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Landing
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Ver portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Dashboard propietario
              </p>
              <h2 className="pt-3 max-w-2xl text-2xl font-semibold tracking-tight">
                Reporte comercial de tus inmuebles
              </h2>
              <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Revisa actividad, solicitudes, citas, ofertas y el estado de los clientes desde una sola pantalla.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
              <HeroStat label="Vistas" value={totals.views} />
              <HeroStat label="Leads" value={totals.leads} />
              <HeroStat label="Citas" value={totals.visits} />
              <HeroStat label="Ofertas" value={totals.offers} />
            </div>
          </div>
        </section>

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
        {listings.length === 0 ? (
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-sm">
            <p className="text-lg font-semibold tracking-tight">Aún no hay inmuebles asignados</p>
            <p className="mx-auto max-w-xl pt-3 text-sm leading-6 text-slate-600">
              Cuando tu inmobiliaria vincule tu propiedad, aquí verás actividad comercial, citas, interesados, documentación y próximos pasos.
            </p>
            <div className="pt-5">
              <Link href="/propietarios" className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]">
                Ver cómo funciona
              </Link>
            </div>
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => {
            const summary = summaries[index];
            const views = summary?.metrics?.views ?? 0;
            const leads = summary?.counts?.leads_total ?? 0;
            const visits = summary?.counts?.leads_visita ?? 0;
            const offers = summary?.counts?.leads_oferta ?? 0;
            const points = summary?.timeseries?.points ?? [];
            const viewSeries = points.map((p) => Number(p.views) || 0);
            const last7 = viewSeries.slice(-7).reduce((a, b) => a + b, 0);
            const prev7 = viewSeries.slice(-14, -7).reduce((a, b) => a + b, 0);
            const nextAction =
              visits > 0
                ? "Revisar citas"
                : leads > 0
                  ? "Actualizar clientes"
                  : "Impulsar anuncio";
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
                  <Row label="Ofertas" value={String(offers)} />
                </div>
                <div className="pt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-600">Últimos 7 días</p>
                    <p className="pt-1 text-lg font-semibold tracking-tight">{last7}</p>
                    <div className="pt-2">
                      <DeltaPill current={last7} previous={prev7} label="vistas" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
                    <div className="w-[180px]">
                      <Sparkline values={viewSeries.length ? viewSeries : [0]} width={140} height={44} />
                    </div>
                  </div>
                </div>
                <p className="pt-5 text-sm font-medium text-[color:var(--foreground)] group-hover:underline">
                  {nextAction}
                </p>
              </Link>
            );
          })}
        </div>
        )}
      </main>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-1 text-2xl font-semibold tracking-tight">{value}</p>
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
