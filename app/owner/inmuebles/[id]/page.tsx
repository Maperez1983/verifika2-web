import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPortalListing } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";
import { hasOwnerService } from "@/lib/ownerAuth";
import { getOwnerSession } from "@/lib/ownerSessionServer";
import { redirect } from "next/navigation";
import Sparkline from "@/components/charts/Sparkline";
import DeltaPill from "@/components/charts/DeltaPill";
import MiniFunnel from "@/components/charts/MiniFunnel";
import ListingCover from "@/components/listings/ListingCover";
import PurchaseItinerary, { type ItineraryStep } from "@/components/operations/PurchaseItinerary";
import type { Listing } from "@/lib/listings";
import {
  consentRedirect,
  consentSubjectForOwner,
  hasPrivacyConsent,
} from "@/lib/privacyConsent";

export const metadata: Metadata = {
  title: "Seguimiento del inmueble",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type HubLead = {
  id: string;
  created_at: string;
  persona: string;
  intent: string;
  contact: string;
  name: string | null;
  note: string | null;
  status: string;
  scheduled_at: string | null;
  outcome: string | null;
  outcome_note: string | null;
};

type HubDoc = {
  id: string;
  created_at: string;
  updated_at: string;
  listing_id: string;
  title: string;
  status: string;
  note: string | null;
};

type HubMilestone = {
  id: string;
  created_at: string;
  updated_at: string;
  listing_id: string;
  key: string;
  title: string;
  status: string;
  due_at: string | null;
  completed_at: string | null;
  note: string | null;
};

type HubSignature = {
  id: string;
  created_at: string;
  updated_at: string;
  listing_id: string;
  title: string;
  status: string;
  provider: string | null;
  external_url: string | null;
  note: string | null;
};

type ListingSummary = {
  metrics: { views: number; last_view_at: string | null };
  counts: { leads_total: number; leads_info: number; leads_visita: number; leads_oferta?: number };
};

type TimeseriesPoint = {
  day: string;
  views: number;
  leads: number;
  visits: number;
  info: number;
  offers?: number;
};

const normalize = (value: unknown) => String(value ?? "").trim();

function leadStatusLabel(status: string) {
  if (status === "contacted") return "Contactado";
  if (status === "scheduled") return "Cita";
  if (status === "done") return "Finalizado";
  if (status === "rejected") return "Descartado";
  return "Nuevo";
}

function commercialStage(leads: number, visits: number, offers: number, scheduledClients: number) {
  if (offers > 0) return "Oferta / negociación";
  if (scheduledClients > 0) return "Visitas programadas";
  if (visits > 0) return "Visitas solicitadas";
  if (leads > 0) return "Captación activa";
  return "Publicado";
}

function ownerNextStep(leads: number, visits: number, offers: number, scheduledClients: number) {
  if (offers > 0) return "Revisar oferta, solvencia y documentación antes de avanzar.";
  if (scheduledClients > 0) return "Confirmar visitas y registrar resultado tras cada cita.";
  if (visits > 0) return "Cerrar fecha/hora de visita con los interesados.";
  if (leads > 0) return "Contactar interesados y clasificar clientes calientes.";
  return "Impulsar el anuncio y comprobar que la ficha comercial está completa.";
}

function leadTemperature(lead: HubLead) {
  if (lead.intent === "oferta" || lead.outcome === "oferta") return "Caliente";
  if (lead.status === "scheduled" || lead.scheduled_at || lead.intent === "visita") return "Templado";
  if (lead.status === "rejected") return "Frío";
  return "Nuevo";
}

function temperatureClass(temp: string) {
  if (temp === "Caliente") return "bg-emerald-50 text-emerald-800";
  if (temp === "Templado") return "bg-amber-50 text-amber-800";
  if (temp === "Frío") return "bg-slate-100 text-slate-600";
  return "bg-blue-50 text-blue-800";
}

function percent(part: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function needed(input: number, output: number, inputLabel: string, outputLabel: string) {
  if (output <= 0) return `Sin ${outputLabel}`;
  return `${Math.max(1, Math.round(input / output))} ${inputLabel}/${outputLabel}`;
}

function efficiencyInsight(views: number, leads: number, visits: number, offers: number) {
  if (views > 20 && leads === 0) return "El anuncio atrae vistas pero no convierte: revisar precio, fotos o mensaje comercial.";
  if (leads > 0 && visits === 0) return "Hay leads sin citas: reforzar contacto, disponibilidad o filtro de comprador.";
  if (visits > 0 && offers === 0) return "Hay visitas sin propuestas: revisar precio, estado del inmueble o expectativas.";
  if (offers > 0) return "Hay propuesta sobre la mesa: priorizar negociación, solvencia y documentación.";
  return "Aún falta volumen para leer la eficiencia comercial con fiabilidad.";
}

function propertyScore(leads: number, visits: number, offers: number, scheduledClients: number) {
  const score = Math.min(96, 40 + Math.min(leads, 10) * 3 + Math.min(visits, 6) * 6 + Math.min(offers, 3) * 10 + Math.min(scheduledClients, 4) * 4);
  if (score >= 78) return { value: score, label: "Alta", tone: "good" as const };
  if (score >= 60) return { value: score, label: "Media", tone: "warning" as const };
  return { value: score, label: "A impulsar", tone: "alert" as const };
}

function ownerPurchaseSteps({
  leads,
  visits,
  offers,
  scheduledClients,
  docs,
  milestones,
}: {
  leads: number;
  visits: number;
  offers: number;
  scheduledClients: number;
  docs: HubDoc[];
  milestones: HubMilestone[];
}): ItineraryStep[] {
  const text = milestones.map((m) => `${m.title} ${m.status}`).join(" ").toLowerCase();
  const docApproved = docs.some((doc) => doc.status === "approved" || doc.status === "uploaded");
  const hasReservation = text.includes("reserva");
  const hasMortgage = text.includes("hipoteca") || text.includes("financi");
  const hasArras = text.includes("arras");
  const hasNotary = text.includes("notar") || text.includes("escritura");
  const hasKeys = text.includes("llave") || text.includes("entrega");
  const milestoneDone = (needle: string) => milestones.some((m) => m.title.toLowerCase().includes(needle) && m.status === "done");

  return [
    {
      key: "published",
      title: "Publicado",
      desc: "Anuncio visible y expediente comercial abierto.",
      status: "done",
      detail: "Ficha activa",
    },
    {
      key: "leads",
      title: "Interesados",
      desc: "Clientes compradores vinculados al inmueble.",
      status: leads > 0 ? "done" : "active",
      detail: `${leads} leads`,
    },
    {
      key: "visits",
      title: "Visitas",
      desc: "Citas solicitadas, programadas o realizadas.",
      status: visits > 0 || scheduledClients > 0 ? "done" : leads > 0 ? "active" : "pending",
      detail: scheduledClients > 0 ? `${scheduledClients} citas programadas` : `${visits} visitas`,
    },
    {
      key: "offer",
      title: "Oferta",
      desc: "Propuesta económica o negociación con comprador.",
      status: offers > 0 ? "active" : "pending",
      detail: `${offers} ofertas`,
    },
    {
      key: "reservation",
      title: "Reserva",
      desc: "Señal, condiciones y plazo de avance.",
      status: milestoneDone("reserva") ? "done" : hasReservation || offers > 0 ? "active" : "pending",
      detail: hasReservation ? "Hito creado" : "Pendiente",
    },
    {
      key: "verification",
      title: "Documentación",
      desc: "Titularidad, cargas, certificados y documentación de venta.",
      status: docApproved ? "done" : docs.length > 0 ? "active" : "pending",
      detail: `${docs.length} documentos`,
    },
    {
      key: "mortgage",
      title: "Financiación comprador",
      desc: "Hipoteca, tasación y aprobación bancaria si aplica.",
      status: hasMortgage ? "active" : "pending",
      detail: hasMortgage ? "En seguimiento" : "Si aplica",
    },
    {
      key: "arras",
      title: "Arras",
      desc: "Contrato, importes, plazos y obligaciones.",
      status: milestoneDone("arras") ? "done" : hasArras ? "active" : "pending",
      detail: hasArras ? "Hito creado" : "Pendiente",
    },
    {
      key: "notary",
      title: "Notaría",
      desc: "Minuta, cheques, fecha y firma de escritura.",
      status: milestoneDone("notar") ? "done" : hasNotary ? "active" : "pending",
      detail: hasNotary ? "En preparación" : "Pendiente",
    },
    {
      key: "keys",
      title: "Llaves y cierre",
      desc: "Entrega, liquidación, suministros y cierre final.",
      status: milestoneDone("llave") || hasKeys ? "active" : "pending",
      detail: hasKeys ? "Hito creado" : "Pendiente",
    },
  ];
}

async function getSummary(listingId: string): Promise<ListingSummary | null> {
  try {
    const res = await leadHubFetch(
      `/v1/metrics?listing_id=${encodeURIComponent(listingId)}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { metrics: data.metrics, counts: data.counts } as ListingSummary;
  } catch {
    return null;
  }
}

async function getTimeseries(listingId: string, days = 14): Promise<TimeseriesPoint[]> {
  try {
    const res = await leadHubFetch(
      `/v1/metrics/timeseries?listing_id=${encodeURIComponent(listingId)}&days=${days}`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { points?: TimeseriesPoint[] };
    return Array.isArray(data?.points) ? data.points : [];
  } catch {
    return [];
  }
}

async function getLeads(listingId: string, intent?: string): Promise<HubLead[]> {
  try {
    const url = new URL("/v1/leads/search", "http://local");
    url.searchParams.set("listing_id", listingId);
    if (intent) url.searchParams.set("intent", intent);
    url.searchParams.set("limit", "100");

    const res = await leadHubFetch(url.pathname + url.search);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.leads) ? (data.leads as HubLead[]) : [];
  } catch {
    return [];
  }
}

async function getDocuments(listingId: string): Promise<HubDoc[]> {
  try {
    const res = await leadHubFetch(
      `/v1/documents?listing_id=${encodeURIComponent(listingId)}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.documents) ? (data.documents as HubDoc[]) : [];
  } catch {
    return [];
  }
}

async function getMilestones(listingId: string): Promise<HubMilestone[]> {
  try {
    const res = await leadHubFetch(
      `/v1/milestones?listing_id=${encodeURIComponent(listingId)}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.milestones)
      ? (data.milestones as HubMilestone[])
      : [];
  } catch {
    return [];
  }
}

async function getSignatures(listingId: string): Promise<HubSignature[]> {
  try {
    const res = await leadHubFetch(
      `/v1/signatures?listing_id=${encodeURIComponent(listingId)}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.signatures)
      ? (data.signatures as HubSignature[])
      : [];
  } catch {
    return [];
  }
}

export default async function OwnerListingPage({ params, searchParams }: PageProps) {
  const session = await getOwnerSession();
  if (!session) redirect("/owner/acceso");

  const { id } = await params;
  const accepted = await hasPrivacyConsent("propietario", consentSubjectForOwner(session));
  if (!accepted) {
    redirect(consentRedirect("/owner/tratamiento-datos", `/owner/inmuebles/${encodeURIComponent(id)}`));
  }

  const sp = (await searchParams) || {};
  const tab = normalize(sp.tab) || "resumen";

  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();
  if (!session.listingIds.includes(listing.id)) notFound();

  const summary = await getSummary(listing.id);
  const timeseries = tab === "resumen" ? await getTimeseries(listing.id, 14) : [];
  const allLeads = tab === "resumen" || tab === "leads" || tab === "clientes" ? await getLeads(listing.id) : [];
  const leads = tab === "leads" ? allLeads : [];
  const clientLeads = tab === "resumen" || tab === "clientes" ? allLeads : [];
  const visits = tab === "visitas" ? await getLeads(listing.id, "visita") : [];
  const agenda = tab === "agenda" ? await getLeads(listing.id, "visita") : [];
  const documents = tab === "resumen" || tab === "docs" ? await getDocuments(listing.id) : [];
  const milestones = tab === "resumen" || tab === "hitos" ? await getMilestones(listing.id) : [];
  const signatures = tab === "firma" ? await getSignatures(listing.id) : [];

  const views = summary?.metrics?.views ?? 0;
  const leadsTotal = summary?.counts?.leads_total ?? 0;
  const leadsInfo = summary?.counts?.leads_info ?? 0;
  const leadsVisits = summary?.counts?.leads_visita ?? 0;
  const leadsOffers = summary?.counts?.leads_oferta ?? clientLeads.filter((lead) => lead.intent === "oferta").length;
  const viewSeries = timeseries.map((p) => Number(p.views) || 0);
  const leadsSeries = timeseries.map((p) => Number(p.leads) || 0);
  const visitsSeries = timeseries.map((p) => Number(p.visits) || 0);
  const offersSeries = timeseries.map((p) => Number(p.offers) || 0);
  const last7Views = viewSeries.slice(-7).reduce((a, b) => a + b, 0);
  const prev7Views = viewSeries.slice(-14, -7).reduce((a, b) => a + b, 0);
  const total14Views = viewSeries.reduce((a, b) => a + b, 0);
  const total14Leads = leadsSeries.reduce((a, b) => a + b, 0);
  const total14Visits = visitsSeries.reduce((a, b) => a + b, 0);
  const total14Offers = offersSeries.reduce((a, b) => a + b, 0);
  const scheduledClients = clientLeads.filter((lead) => lead.status === "scheduled" || Boolean(lead.scheduled_at)).length;
  const activeClients = clientLeads.filter((lead) => ["new", "contacted", "scheduled"].includes(lead.status || "new")).length;
  const doneClients = clientLeads.filter((lead) => lead.status === "done").length;
  const conversionRate = views > 0 ? Math.round((leadsTotal / views) * 100) : 0;
  const stage = commercialStage(leadsTotal, leadsVisits, leadsOffers, scheduledClients);
  const nextStep = ownerNextStep(leadsTotal, leadsVisits, leadsOffers, scheduledClients);
  const score = propertyScore(leadsTotal, leadsVisits, leadsOffers, scheduledClients);
  const purchaseTrackingEnabled = hasOwnerService(session, "purchase_tracking");
  const nextAction =
    scheduledClients > 0
      ? "Revisar próximas citas"
      : activeClients > 0
        ? "Actualizar estado de clientes"
        : "Impulsar captación de leads";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,193,78,0.32),rgba(242,193,78,0)_60%)] blur-2xl" />
        <div className="absolute right-[-200px] top-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.12),rgba(24,24,27,0)_60%)] blur-2xl" />
      </div>
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/owner"
              className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
            >
              ← Volver al panel
            </Link>
            <BrandPill dark />
            <h1 className="pt-3 text-2xl font-semibold tracking-tight">
              {listing.title}
            </h1>
            <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi label="Vistas" value={views} />
            <Kpi label="Solicitudes" value={leadsTotal} />
            <Kpi label="Visitas" value={leadsVisits} />
            <Kpi label="Ofertas" value={leadsOffers} />
          </div>
        </div>

        <div className="border-t border-[color:var(--border)]">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-6 py-4">
            <Tab href={`/owner/inmuebles/${listing.id}?tab=resumen`} active={tab === "resumen"}>
              Resumen
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=leads`} active={tab === "leads"}>
              Leads
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=clientes`} active={tab === "clientes"}>
              Clientes
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=visitas`} active={tab === "visitas"}>
              Visitas
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=agenda`} active={tab === "agenda"}>
              Agenda
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=docs`} active={tab === "docs"}>
              Documentos
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=hitos`} active={tab === "hitos"}>
              Hitos
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=firma`} active={tab === "firma"}>
              Firma
            </Tab>
            <Tab href={`/owner/inmuebles/${listing.id}?tab=anuncio`} active={tab === "anuncio"}>
              Anuncio
            </Tab>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {!summary ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pueden cargar métricas.</p>
            <p className="pt-2 leading-6">
              El Owner Portal no está pudiendo leer el Lead Hub (`/v1/metrics`). Revisa variables del servicio `verifika2-web`.
            </p>
          </div>
        ) : null}
        {tab === "resumen" ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] text-white shadow-sm">
                <div className="grid gap-0 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <ListingCover
                      id={listing.id}
                      src={listing.photo}
                      title={listing.title}
                      location={listing.city}
                      label={listing.certified ? "Certificado" : "Verificado"}
                      tone="dark"
                    />
                  </div>
                  <div className="p-6 lg:col-span-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <BrandPill />
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/64">
                          Reporte propietario
                        </p>
                        <h2 className="pt-3 text-2xl font-semibold tracking-tight">
                          {nextAction}
                        </h2>
                        <p className="pt-3 text-sm leading-6 text-white/72">
                          {listing.priceLabel} · {listing.detailsShort}. El anuncio acumula {views} vistas, {leadsTotal} leads, {leadsVisits} visitas y {leadsOffers} ofertas registradas.
                        </p>
                      </div>
                      <ScoreDial value={score.value} label={score.label} tone={score.tone} />
                    </div>
                    <div className="mt-5 rounded-3xl border border-white/12 bg-white/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                        Estado de operación
                      </p>
                      <p className="pt-2 text-lg font-semibold tracking-tight">{stage}</p>
                      <p className="pt-2 text-sm leading-6 text-white/72">{nextStep}</p>
                    </div>
                    <div className="pt-5 grid gap-3 sm:grid-cols-3">
                      <HeroMetric label="Clientes activos" value={activeClients} />
                      <HeroMetric label="Citas" value={scheduledClients} />
                      <HeroMetric label="Conversión" value={`${conversionRate}%`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <SignalCard title="Leads" value={leadsTotal} desc={`${leadsInfo} consultas, ${leadsVisits} visitas y ${leadsOffers} ofertas.`} />
                <SignalCard title="Clientes" value={activeClients} desc={`${doneClients} cerrados o finalizados. Mantén cada estado actualizado.`} />
                <SignalCard title="Anuncio" value={listing.certified ? "Premium" : "Activo"} desc="Ficha pública disponible para revisar fotos, precio y descripción." />
              </div>

              {purchaseTrackingEnabled ? (
                <div className="mt-6">
                  <PurchaseItinerary
                    title="Itinerario de compraventa"
                    subtitle="Ruta operativa visible para el propietario: interesados, visitas, oferta, reserva, documentación, financiación, arras, notaría y cierre."
                    steps={ownerPurchaseSteps({
                      leads: leadsTotal,
                      visits: leadsVisits,
                      offers: leadsOffers,
                      scheduledClients,
                      docs: documents,
                      milestones,
                    })}
                    nextAction={nextStep}
                  />
                </div>
              ) : null}

              <div className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">Timeline comercial</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Lectura rápida del punto exacto de la operación.
                </p>
                <div className="pt-5">
                  <OperationTimeline leads={leadsTotal} visits={leadsVisits} offers={leadsOffers} scheduled={scheduledClients} />
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">Eficiencia comercial</p>
                    <p className="pt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Ratios clave del inmueble: cuántas vistas generan leads, cuántos leads generan citas y cuántas citas generan propuesta.
                    </p>
                  </div>
                  <p className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm leading-6 text-slate-700 lg:max-w-sm">
                    {efficiencyInsight(views, leadsTotal, leadsVisits, leadsOffers)}
                  </p>
                </div>
                <div className="pt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <RatioCard label="Vistas → lead" value={percent(leadsTotal, views)} detail={needed(views, leadsTotal, "vistas", "lead")} />
                  <RatioCard label="Lead → cita" value={percent(leadsVisits, leadsTotal)} detail={needed(leadsTotal, leadsVisits, "leads", "cita")} />
                  <RatioCard label="Cita → propuesta" value={percent(leadsOffers, leadsVisits)} detail={needed(leadsVisits, leadsOffers, "citas", "propuesta")} />
                  <RatioCard label="Lead → propuesta" value={percent(leadsOffers, leadsTotal)} detail={needed(leadsTotal, leadsOffers, "leads", "propuesta")} />
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">
                  Qué ve el propietario
                </p>
                <div className="pt-6 grid gap-3 sm:grid-cols-2">
                  <Card title="Leads" desc="Todas las solicitudes con contacto, fecha, origen y mensaje." />
                  <Card title="Citas" desc="Visitas programadas y resultado de cada cliente." />
                  <Card title="Estado de clientes" desc="Nuevo, contactado, cita, finalizado o descartado." />
                  <Card title="Anuncio" desc="Vista de la ficha pública publicada en Verifika2." />
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">Evolución (14 días)</p>
                    <p className="pt-2 text-sm leading-6 text-slate-600">
                      Tendencia simple para entender si el anuncio “mueve” interés. (Beta: las vistas diarias se empiezan a registrar desde que activamos el tracking.)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2">
                    <p className="text-xs font-medium text-slate-600">Últimos 7 días</p>
                    <p className="pt-1 text-lg font-semibold tracking-tight">{last7Views}</p>
                    <div className="pt-2">
                      <DeltaPill current={last7Views} previous={prev7Views} label="vistas" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold">Vistas (día)</p>
                      <span className="text-xs text-slate-600">
                        Total 14 días: <span className="font-semibold text-[color:var(--foreground)]">{total14Views}</span>
                      </span>
                    </div>
                    <div className="pt-4">
                      <Sparkline values={viewSeries.length ? viewSeries : [0]} width={320} height={72} />
                    </div>
                    <p className="pt-3 text-xs text-slate-600">
                      Última vista:{" "}
                      <span className="font-medium text-[color:var(--foreground)]">
                        {summary?.metrics?.last_view_at ? new Date(summary.metrics.last_view_at).toLocaleString("es-ES") : "—"}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
                    <p className="text-sm font-semibold">Funnel (14 días)</p>
                    <p className="pt-2 text-xs leading-5 text-slate-600">
                      Conversión rápida: vistas → solicitudes → visitas.
                    </p>
                    <div className="pt-4">
                      <MiniFunnel views={Math.max(0, total14Views)} leads={Math.max(0, total14Leads)} visits={Math.max(0, total14Visits)} />
                    </div>
                    <p className="pt-3 text-xs text-slate-600">
                      Ofertas en 14 días: <span className="font-semibold text-[color:var(--foreground)]">{total14Offers}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-4">
              <OwnerReportCard
                views={views}
                leads={leadsTotal}
                visits={leadsVisits}
                offers={leadsOffers}
                activeClients={activeClients}
                scheduledClients={scheduledClients}
                conversionRate={conversionRate}
                lastViewAt={summary?.metrics?.last_view_at ?? null}
              />
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">Qué hace ahora el equipo</p>
                <div className="pt-4 grid gap-3">
                  <ActionLine done={leadsTotal > 0} text="Revisar cada lead y clasificar interés real." />
                  <ActionLine done={scheduledClients > 0} text="Confirmar citas y registrar resultado." />
                  <ActionLine done={leadsOffers > 0} text="Preparar oferta, documentación y siguiente hito." />
                  <ActionLine done={listing.certified} text="Mantener anuncio y verificación documental visibles." />
                </div>
              </div>
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">Acciones rápidas</p>
                <div className="pt-4 grid gap-2">
                  <Link
                    href={`/owner/inmuebles/${listing.id}?tab=visitas`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Ver visitas
                  </Link>
                  <Link
                    href={`/owner/inmuebles/${listing.id}?tab=clientes`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Estado clientes
                  </Link>
                  <Link
                    href={`/owner/inmuebles/${listing.id}?tab=anuncio`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Ver anuncio
                  </Link>
                </div>
                <p className="pt-4 text-xs leading-5 text-slate-600">
                  Beta: la firma digital y el timeline completo se activan en la
                  siguiente fase.
                </p>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "leads" ? (
          <LeadsSection
            listingId={listing.id}
            leads={leads}
            returnTo={`/owner/inmuebles/${listing.id}?tab=leads`}
          />
        ) : null}

        {tab === "clientes" ? (
          <ClientsSection
            leads={clientLeads}
            returnTo={`/owner/inmuebles/${listing.id}?tab=clientes`}
          />
        ) : null}

        {tab === "visitas" ? (
          <VisitsSection
            listingId={listing.id}
            leads={visits}
            returnTo={`/owner/inmuebles/${listing.id}?tab=visitas`}
          />
        ) : null}

        {tab === "agenda" ? (
          <AgendaSection
            listingId={listing.id}
            leads={agenda}
            returnTo={`/owner/inmuebles/${listing.id}?tab=agenda`}
          />
        ) : null}

        {tab === "docs" ? (
          <DocumentsSection
            listingId={listing.id}
            documents={documents}
            returnTo={`/owner/inmuebles/${listing.id}?tab=docs`}
          />
        ) : null}

        {tab === "hitos" ? (
          <MilestonesSection
            listingId={listing.id}
            milestones={milestones}
            returnTo={`/owner/inmuebles/${listing.id}?tab=hitos`}
          />
        ) : null}

        {tab === "firma" ? (
          <SignaturesSection
            listingId={listing.id}
            signatures={signatures}
            returnTo={`/owner/inmuebles/${listing.id}?tab=firma`}
          />
        ) : null}

        {tab === "anuncio" ? (
          <AnnouncementSection listing={listing} />
        ) : null}
      </main>
    </div>
  );
}

function BrandPill({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`mb-4 inline-flex items-center gap-2 rounded-2xl border px-3 py-2 ${dark ? "border-slate-200 bg-white" : "border-white/14 bg-white/10"}`}>
      <Image
        src={dark ? "/brand/verifika2_wordmark_traced_dark.svg" : "/brand/verifika2_wordmark_traced.svg"}
        alt="Verifika²"
        width={96}
        height={24}
        className="h-5 w-auto"
      />
      <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-white/64"}`}>
        Reporte privado
      </span>
    </div>
  );
}

function ScoreDial({ value, label, tone }: { value: number; label: string; tone: "good" | "warning" | "alert" }) {
  const color = tone === "good" ? "#22c55e" : tone === "warning" ? "#f2c14e" : "#fb7185";
  return (
    <div
      className="grid h-[82px] w-[82px] shrink-0 place-items-center rounded-full border border-white/16 text-center shadow-[inset_0_0_0_6px_rgba(255,255,255,0.04)]"
      style={{
        background: `radial-gradient(circle at center, #0B1D33 0 55%, transparent 56%), conic-gradient(${color} ${value}%, rgba(255,255,255,0.14) 0)`,
      }}
      aria-label={`Índice comercial ${value}. ${label}`}
    >
      <div>
        <p className="text-xl font-semibold leading-none text-white">{value}</p>
        <p className="pt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/62">{label}</p>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-1 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/10 px-4 py-3">
      <p className="text-xs font-medium text-white/64">{label}</p>
      <p className="pt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function SignalCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: number | string;
  desc: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <p className="pt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function RatioCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="pt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function OwnerReportCard({
  views,
  leads,
  visits,
  offers,
  activeClients,
  scheduledClients,
  conversionRate,
  lastViewAt,
}: {
  views: number;
  leads: number;
  visits: number;
  offers: number;
  activeClients: number;
  scheduledClients: number;
  conversionRate: number;
  lastViewAt: string | null;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">Reporte rápido</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">
        Resumen comercial para entender si el anuncio genera actividad real.
      </p>
      <div className="pt-5 grid gap-3">
        <ReportRow label="Vistas acumuladas" value={views} />
        <ReportRow label="Leads recibidos" value={leads} />
        <ReportRow label="Visitas solicitadas" value={visits} />
        <ReportRow label="Ofertas" value={offers} />
        <ReportRow label="Clientes activos" value={activeClients} />
        <ReportRow label="Citas programadas" value={scheduledClients} />
        <ReportRow label="Conversión" value={`${conversionRate}%`} />
      </div>
      <p className="pt-4 text-xs leading-5 text-slate-600">
        Última vista:{" "}
        <span className="font-medium text-[color:var(--foreground)]">
          {lastViewAt ? new Date(lastViewAt).toLocaleString("es-ES") : "Sin vistas registradas"}
        </span>
      </p>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-[color:var(--foreground)]">{value}</span>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const cls = active
    ? "bg-[#0B1D33] text-white border-[#0B1D33]"
    : "bg-[color:var(--surface)] text-slate-700 hover:bg-[color:var(--surface-2)]";
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] px-4 text-sm font-medium ${cls}`}
    >
      {children}
    </Link>
  );
}

function OperationTimeline({
  leads,
  visits,
  offers,
  scheduled,
}: {
  leads: number;
  visits: number;
  offers: number;
  scheduled: number;
}) {
  const steps = [
    { label: "Publicado", desc: "Ficha visible", active: true },
    { label: "Leads", desc: `${leads} solicitudes`, active: leads > 0 },
    { label: "Visitas", desc: scheduled > 0 ? `${scheduled} citas` : `${visits} solicitudes`, active: visits > 0 || scheduled > 0 },
    { label: "Oferta", desc: `${offers} ofertas`, active: offers > 0 },
    { label: "Cierre", desc: "Pendiente", active: false },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {steps.map((step) => (
        <div
          key={step.label}
          className={`rounded-3xl border p-4 ${step.active ? "border-[#0B1D33] bg-[#0B1D33] text-white" : "border-[color:var(--border)] bg-[color:var(--surface-2)] text-slate-600"}`}
        >
          <p className="text-sm font-semibold tracking-tight">{step.label}</p>
          <p className={`pt-2 text-xs leading-5 ${step.active ? "text-white/70" : "text-slate-500"}`}>{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ActionLine({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <span className={`mt-0.5 h-5 w-5 rounded-full text-center text-xs font-semibold leading-5 ${done ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
        {done ? "✓" : "·"}
      </span>
      <p className="text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function ClientsSection({
  leads,
  returnTo,
}: {
  leads: HubLead[];
  returnTo: string;
}) {
  const active = leads.filter((lead) => ["new", "contacted", "scheduled"].includes(lead.status || "new"));
  const scheduled = leads.filter((lead) => lead.status === "scheduled" || Boolean(lead.scheduled_at));
  const offers = leads.filter((lead) => lead.intent === "oferta" || lead.outcome === "oferta");
  const closed = leads.filter((lead) => lead.status === "done" || lead.status === "rejected");

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-4">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Estado de clientes</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Vista ejecutiva para propietario: quién ha entrado, qué quiere y en qué punto está.
          </p>
          <div className="pt-5 grid gap-3">
            <ReportRow label="Activos" value={active.length} />
            <ReportRow label="Con cita" value={scheduled.length} />
            <ReportRow label="Oferta / negociación" value={offers.length} />
            <ReportRow label="Finalizados" value={closed.length} />
          </div>
        </div>
      </section>
      <section className="lg:col-span-8">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Clientes y seguimiento</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Actualiza estado, agenda y resultado para que el propietario vea el avance real de cada interesado.
          </p>
          <div className="pt-6 grid gap-3">
            {leads.length === 0 ? (
              <Empty text="Aún no hay clientes registrados para este inmueble." />
            ) : (
              leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  returnTo={returnTo}
                  showVisitFields={lead.intent === "visita" || lead.intent === "oferta"}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AnnouncementSection({ listing }: { listing: Listing }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
          <ListingCover
            id={listing.id}
            src={listing.photo}
            title={listing.title}
            location={listing.city}
            label={listing.certified ? "Certificado" : "Verificado"}
          />
          <div className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Vista publicada
            </p>
            <h2 className="pt-3 text-2xl font-semibold tracking-tight">
              {listing.title}
            </h2>
            <p className="pt-2 text-sm text-slate-600">
              {[listing.zone, listing.city, listing.province].filter(Boolean).join(", ") || listing.city}
            </p>
            <p className="pt-5 text-3xl font-semibold tracking-tight">
              {listing.priceLabel}
            </p>
            <p className="pt-4 text-sm leading-7 text-slate-700">
              {listing.description}
            </p>
          </div>
        </div>
      </section>
      <aside className="lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Datos del anuncio</p>
            <div className="pt-5 grid gap-3">
              <ReportRow label="Operación" value={listing.operation === "alquiler" ? "Alquiler" : "Venta"} />
              <ReportRow label="Tipo" value={listing.propertyType} />
              <ReportRow label="Estado" value={listing.certified ? "Certificado" : "Verificado"} />
              <ReportRow label="Fotos" value={listing.photos?.length ?? (listing.photo ? 1 : 0)} />
            </div>
            <div className="pt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/inmuebles/${encodeURIComponent(listing.id)}`}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Abrir anuncio
              </Link>
              <Link
                href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&next=${encodeURIComponent(`/owner/inmuebles/${listing.id}?tab=anuncio`)}`}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Probar lead
              </Link>
            </div>
          </div>
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Características</p>
            <div className="pt-4 flex flex-wrap gap-2">
              {listing.details.map((detail) => (
                <span
                  key={detail}
                  className="rounded-full bg-[color:var(--surface-2)] px-3 py-2 text-xs font-medium text-slate-700"
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function LeadsSection({
  listingId,
  leads,
  returnTo,
}: {
  listingId: string;
  leads: HubLead[];
  returnTo: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-tight">Leads</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Solicitudes recibidas desde el portal (info/visita). Aquí puedes
            registrar el estado para trazabilidad.
          </p>
        </div>
        <Link
          href={`/inmuebles/${encodeURIComponent(listingId)}`}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
        >
          Ver anuncio
        </Link>
      </div>

      <div className="pt-6 grid gap-3">
        {leads.length === 0 ? (
          <Empty text="Aún no hay solicitudes registradas para este inmueble." />
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} returnTo={returnTo} />
          ))
        )}
      </div>
    </div>
  );
}

function VisitsSection({
  leads,
  returnTo,
}: {
  listingId: string;
  leads: HubLead[];
  returnTo: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">Visitas</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">
        Solicitudes de visita. Registra la cita y el resultado para mantener
        control y trazabilidad.
      </p>
      <div className="pt-6 grid gap-3">
        {leads.length === 0 ? (
          <Empty text="Aún no hay visitas solicitadas para este inmueble." />
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} returnTo={returnTo} showVisitFields />
          ))
        )}
      </div>
    </div>
  );
}

function AgendaSection({
  listingId,
  leads,
  returnTo,
}: {
  listingId: string;
  leads: HubLead[];
  returnTo: string;
}) {
  const scheduled = leads
    .filter((lead) => Boolean(lead.scheduled_at))
    .sort((a, b) => {
      const da = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
      const db = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
      return da - db;
    });

  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-tight">Agenda</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Citas programadas para este inmueble. Puedes editar estado/fecha/resultado desde cada tarjeta.
          </p>
        </div>
        <Link
          href={`/inmuebles/${encodeURIComponent(listingId)}`}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
        >
          Ver anuncio
        </Link>
      </div>

      <div className="pt-6 grid gap-3">
        {scheduled.length === 0 ? (
          <Empty text="Aún no hay citas programadas (usa la pestaña Visitas para registrar fecha/hora)." />
        ) : (
          scheduled.map((lead) => (
            <LeadCard key={lead.id} lead={lead} returnTo={returnTo} showVisitFields />
          ))
        )}
      </div>
    </div>
  );
}

function DocumentsSection({
  listingId,
  documents,
  returnTo,
}: {
  listingId: string;
  documents: HubDoc[];
  returnTo: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">Documentos</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">
        Checklist y repositorio documental (beta). En la siguiente fase se
        almacenará el archivo y se habilitará firma digital.
      </p>

      {documents.length === 0 ? (
        <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold">Checklist recomendada</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Crea una lista base de documentos para empezar (puedes editarla después).
              </p>
            </div>
            <form method="post" action="/api/owner/documents/seed">
              <input type="hidden" name="listing_id" value={listingId} />
              <input type="hidden" name="return_to" value={returnTo} />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Crear checklist
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
        <p className="text-sm font-semibold">Solicitar documento</p>
        <form method="post" action="/api/owner/documents/create" className="pt-4 grid gap-2 sm:grid-cols-12">
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="return_to" value={returnTo} />
          <input
            name="title"
            placeholder="Ej: Nota simple, certificado energético…"
            className="sm:col-span-8 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
            required
          />
          <button
            type="submit"
            className="sm:col-span-4 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Añadir
          </button>
        </form>
      </div>

      <div className="pt-6 grid gap-3">
        {documents.length === 0 ? (
          <Empty text="Aún no hay documentos solicitados para este inmueble." />
        ) : (
          documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} returnTo={returnTo} />
          ))
        )}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 py-4 text-sm text-slate-700">
      {text}
    </div>
  );
}

function pill(status: string) {
  if (status === "new") return "bg-slate-100 text-slate-800";
  if (status === "scheduled") return "bg-emerald-50 text-emerald-800";
  if (status === "done") return "bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function LeadCard({
  lead,
  returnTo,
  showVisitFields,
}: {
  lead: HubLead;
  returnTo: string;
  showVisitFields?: boolean;
}) {
  const temperature = leadTemperature(lead);
  const next =
    temperature === "Caliente"
      ? "Preparar documentación y negociación."
      : temperature === "Templado"
        ? "Confirmar visita y registrar feedback."
        : lead.status === "rejected"
          ? "Mantener como descartado o reabrir si cambia el contexto."
          : "Contactar y clasificar interés real.";
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill(lead.status)}`}>
              {leadStatusLabel(lead.status)}
            </span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {lead.intent}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${temperatureClass(temperature)}`}>
              {temperature}
            </span>
          </div>
          <p className="pt-3 text-sm font-semibold tracking-tight">
            {lead.name || "Sin nombre"} · {lead.contact}
          </p>
          <p className="pt-2 text-sm text-slate-600">
            Recibido: {new Date(lead.created_at).toLocaleString("es-ES")}
          </p>
          {lead.note ? (
            <p className="pt-2 text-sm leading-6 text-slate-700">{lead.note}</p>
          ) : null}
          {lead.scheduled_at ? (
            <p className="pt-2 text-sm text-slate-600">
              Cita:{" "}
              <span className="font-medium text-[color:var(--foreground)]">
                {new Date(lead.scheduled_at).toLocaleString("es-ES")}
              </span>
            </p>
          ) : null}
          {lead.outcome || lead.outcome_note ? (
            <p className="pt-2 text-sm text-slate-600">
              Resultado:{" "}
              <span className="font-medium text-[color:var(--foreground)]">
                {lead.outcome || "—"}
              </span>
              {lead.outcome_note ? ` · ${lead.outcome_note}` : ""}
            </p>
          ) : null}
          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Próxima acción</p>
            <p className="pt-1 text-sm leading-6 text-slate-700">{next}</p>
          </div>
        </div>

        <form
          method="post"
          action={`/api/owner/leads/${encodeURIComponent(lead.id)}/status`}
          className="grid gap-2 sm:w-[280px]"
        >
          <input type="hidden" name="return_to" value={returnTo} />
          <label className="text-xs font-medium text-slate-600" htmlFor={`status_${lead.id}`}>
            Estado
          </label>
          <select
            id={`status_${lead.id}`}
            name="status"
            defaultValue={lead.status || "new"}
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="new">Nuevo</option>
            <option value="contacted">Contactado</option>
            <option value="scheduled">Cita</option>
            <option value="done">Finalizado</option>
            <option value="rejected">Descartado</option>
          </select>

	          {showVisitFields ? (
	            <>
              <label className="text-xs font-medium text-slate-600" htmlFor={`scheduled_${lead.id}`}>
                Fecha/hora (opcional)
              </label>
	              <input
	                id={`scheduled_${lead.id}`}
	                name="scheduled_at"
	                type="datetime-local"
	                defaultValue={toDateTimeLocal(lead.scheduled_at)}
	                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
	              />
	              <label className="text-xs font-medium text-slate-600" htmlFor={`outcome_${lead.id}`}>
	                Resultado (opcional)
	              </label>
	              <select
	                id={`outcome_${lead.id}`}
	                name="outcome"
	                defaultValue={lead.outcome ?? ""}
	                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
	              >
	                <option value="">Sin registrar</option>
	                <option value="interesado">Interesado</option>
	                <option value="no_interesado">No interesado</option>
	                <option value="oferta">Oferta / negociación</option>
	                <option value="pendiente">Pendiente</option>
	              </select>
	              <label className="text-xs font-medium text-slate-600" htmlFor={`note_${lead.id}`}>
	                Nota (opcional)
	              </label>
	              <input
	                id={`note_${lead.id}`}
	                name="outcome_note"
	                placeholder="Ej: Confirma asistencia, feedback…"
	                defaultValue={lead.outcome_note ?? ""}
	                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
	              />
	            </>
	          ) : null}

          <button
            type="submit"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

function docPill(status: string) {
  if (status === "uploaded") return "bg-emerald-50 text-emerald-800";
  if (status === "approved") return "bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function DocCard({ doc, returnTo }: { doc: HubDoc; returnTo: string }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${docPill(doc.status)}`}>
              {doc.status}
            </span>
          </div>
          <p className="pt-3 text-sm font-semibold tracking-tight">{doc.title}</p>
          <p className="pt-2 text-sm text-slate-600">
            Actualizado: {new Date(doc.updated_at).toLocaleString("es-ES")}
          </p>
          {doc.note ? (
            <p className="pt-2 text-sm leading-6 text-slate-700">{doc.note}</p>
          ) : null}
        </div>

        <form
          method="post"
          action={`/api/owner/documents/${encodeURIComponent(doc.id)}`}
          className="grid gap-2 sm:w-[280px]"
        >
          <input type="hidden" name="return_to" value={returnTo} />
          <label className="text-xs font-medium text-slate-600" htmlFor={`doc_${doc.id}`}>
            Estado
          </label>
          <select
            id={`doc_${doc.id}`}
            name="status"
            defaultValue={doc.status}
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="pending">Pendiente</option>
            <option value="uploaded">Subido</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
          <button
            type="submit"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

function milestonePill(status: string) {
  if (status === "done") return "bg-emerald-50 text-emerald-800";
  if (status === "in_progress") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function MilestonesSection({
  listingId,
  milestones,
  returnTo,
}: {
  listingId: string;
  milestones: HubMilestone[];
  returnTo: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">Hitos</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">
        Timeline de la operación (beta): reserva, arras, notaría, entrega de llaves… con estado y trazabilidad.
      </p>

      {milestones.length === 0 ? (
        <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold">Timeline estándar</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Crea los hitos típicos (reserva, arras, notaría, llaves…) y edítalos según la operación.
              </p>
            </div>
            <form method="post" action="/api/owner/milestones/seed">
              <input type="hidden" name="listing_id" value={listingId} />
              <input type="hidden" name="return_to" value={returnTo} />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Crear hitos
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
        <p className="text-sm font-semibold">Añadir hito</p>
        <form method="post" action="/api/owner/milestones/create" className="pt-4 grid gap-2 sm:grid-cols-12">
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="return_to" value={returnTo} />
          <input
            name="title"
            placeholder="Ej: Firma de arras"
            className="sm:col-span-8 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
            required
          />
          <button
            type="submit"
            className="sm:col-span-4 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Añadir
          </button>
        </form>
      </div>

      <div className="pt-6 grid gap-3">
        {milestones.length === 0 ? (
          <Empty text="Aún no hay hitos para este inmueble." />
        ) : (
          milestones.map((m) => (
            <div key={m.id} className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${milestonePill(m.status)}`}>
                    {m.status}
                  </span>
                  <p className="pt-3 text-sm font-semibold tracking-tight">{m.title}</p>
                  {m.due_at ? (
                    <p className="pt-2 text-sm text-slate-600">
                      Fecha prevista: {new Date(m.due_at).toLocaleString("es-ES")}
                    </p>
                  ) : null}
                </div>
                <form method="post" action={`/api/owner/milestones/${encodeURIComponent(m.id)}`} className="grid gap-2 sm:w-[280px]">
                  <input type="hidden" name="return_to" value={returnTo} />
                  <label className="text-xs font-medium text-slate-600" htmlFor={`m_${m.id}`}>
                    Estado
                  </label>
                  <select
                    id={`m_${m.id}`}
                    name="status"
                    defaultValue={m.status}
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En curso</option>
                    <option value="done">Hecho</option>
                  </select>
                  <button type="submit" className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]">
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function signaturePill(status: string) {
  if (status === "signed") return "bg-emerald-50 text-emerald-800";
  if (status === "sent") return "bg-amber-50 text-amber-800";
  if (status === "failed") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function SignaturesSection({
  listingId,
  signatures,
  returnTo,
}: {
  listingId: string;
  signatures: HubSignature[];
  returnTo: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">Firma digital</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">
        Beta: registra solicitudes de firma (arras, anexos, autorización…) y su estado. En la siguiente fase se integrará el proveedor de firma.
      </p>

      <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
        <p className="text-sm font-semibold">Solicitar firma</p>
        <form method="post" action="/api/owner/signatures/create" className="pt-4 grid gap-2 sm:grid-cols-12">
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="return_to" value={returnTo} />
          <input
            name="title"
            placeholder="Ej: Contrato de arras"
            className="sm:col-span-8 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
            required
          />
          <button
            type="submit"
            className="sm:col-span-4 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Crear
          </button>
        </form>
      </div>

      <div className="pt-6 grid gap-3">
        {signatures.length === 0 ? (
          <Empty text="Aún no hay solicitudes de firma para este inmueble." />
        ) : (
          signatures.map((s) => (
            <div key={s.id} className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${signaturePill(s.status)}`}>
                    {s.status}
                  </span>
                  <p className="pt-3 text-sm font-semibold tracking-tight">{s.title}</p>
                  <p className="pt-2 text-sm text-slate-600">
                    Actualizado: {new Date(s.updated_at).toLocaleString("es-ES")}
                  </p>
                  {s.external_url ? (
                    <a className="pt-2 block text-sm font-medium text-[color:var(--foreground)] hover:underline" href={s.external_url}>
                      Abrir enlace
                    </a>
                  ) : null}
                </div>
                <form method="post" action={`/api/owner/signatures/${encodeURIComponent(s.id)}`} className="grid gap-2 sm:w-[280px]">
                  <input type="hidden" name="return_to" value={returnTo} />
                  <label className="text-xs font-medium text-slate-600" htmlFor={`s_${s.id}`}>
                    Estado
                  </label>
                  <select
                    id={`s_${s.id}`}
                    name="status"
                    defaultValue={s.status}
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviado</option>
                    <option value="signed">Firmado</option>
                    <option value="failed">Fallido</option>
                  </select>
                  <button type="submit" className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]">
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
