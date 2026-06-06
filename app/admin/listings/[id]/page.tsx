import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPortalListing } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin · Inmueble",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type HubMetrics = { views: number; last_view_at: string | null };
type HubCounts = { leads_total: number; leads_info: number; leads_visita: number };

type HubDoc = { id: string; title: string; status: string; note: string | null; created_at: string; updated_at: string };
type HubMilestone = { id: string; key: string; title: string; status: string; due_at: string | null; completed_at: string | null; note: string | null; created_at: string; updated_at: string };
type HubSignature = { id: string; title: string; status: string; provider: string | null; external_url: string | null; note: string | null; created_at: string; updated_at: string };
type HubLead = { id: string; created_at: string; persona: string; intent: string; contact: string; name: string | null; status: string; scheduled_at: string | null; outcome: string | null; outcome_note: string | null };
type OperationService = { id: string; created_at: string; updated_at: string; listing_id: string; subject_type: string; subject_contact: string | null; subject_id: string | null; service: string; status: string; note: string | null; activated_by: string | null };
type ServiceAudit = { id: string; created_at: string; listing_id: string | null; subject_type: string | null; subject_contact: string | null; service: string | null; action: string; status: string | null; actor: string | null; note: string | null };

async function getMetrics(listingId: string): Promise<{ metrics: HubMetrics; counts: HubCounts } | null> {
  try {
    const res = await leadHubFetch(`/v1/metrics?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return { metrics: data.metrics as HubMetrics, counts: data.counts as HubCounts };
  } catch {
    return null;
  }
}

async function getDocs(listingId: string): Promise<HubDoc[]> {
  try {
    const res = await leadHubFetch(`/v1/documents?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.documents) ? (data.documents as HubDoc[]) : [];
  } catch {
    return [];
  }
}

async function getMilestones(listingId: string): Promise<HubMilestone[]> {
  try {
    const res = await leadHubFetch(`/v1/milestones?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.milestones) ? (data.milestones as HubMilestone[]) : [];
  } catch {
    return [];
  }
}

async function getSignatures(listingId: string): Promise<HubSignature[]> {
  try {
    const res = await leadHubFetch(`/v1/signatures?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.signatures) ? (data.signatures as HubSignature[]) : [];
  } catch {
    return [];
  }
}

async function getListingLeads(listingId: string): Promise<HubLead[]> {
  try {
    const res = await leadHubFetch(`/v1/leads/search?listing_id=${encodeURIComponent(listingId)}&limit=80`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.leads) ? (data.leads as HubLead[]) : [];
  } catch {
    return [];
  }
}

async function getOperationServices(listingId: string): Promise<OperationService[]> {
  try {
    const res = await leadHubFetch(`/v1/operation_services?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.services) ? (data.services as OperationService[]) : [];
  } catch {
    return [];
  }
}

async function getServiceAudit(listingId: string): Promise<ServiceAudit[]> {
  try {
    const res = await leadHubFetch(`/v1/service_audit?listing_id=${encodeURIComponent(listingId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.audit) ? (data.audit as ServiceAudit[]) : [];
  } catch {
    return [];
  }
}

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function AdminListingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = (await searchParams) || {};
  const ok = normalize(sp.ok) === "1";
  const error = normalize(sp.error);
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();
  const published = Boolean((listing as { published?: boolean }).published);

  const metrics = await getMetrics(listing.id);
  const [documents, milestones, signatures, leads, operationServices, serviceAudit] = await Promise.all([
    getDocs(listing.id),
    getMilestones(listing.id),
    getSignatures(listing.id),
    getListingLeads(listing.id),
    getOperationServices(listing.id),
    getServiceAudit(listing.id),
  ]);
  const buyerLeads = leads.filter((lead) => lead.persona === "comprador");

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/admin/listings"
            className="text-sm font-medium text-white/64 hover:text-white"
          >
            ← Volver a inmuebles
          </Link>
          <div className="pt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    published ? "bg-emerald-400/18 text-emerald-100" : "bg-amber-400/18 text-amber-100"
                  }`}
                >
                  {published ? "Publicado" : "Oculto"}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/72">
                  {listing.certified ? "Certificación premium" : "Verificado"}
                </span>
              </div>
              <h1 className="pt-4 text-3xl font-semibold tracking-tight">{listing.title}</h1>
              <p className="pt-2 text-sm text-white/64">{listing.city} · {listing.priceLabel}</p>
              <p className="pt-2 text-sm text-white/64">
                Portal:{" "}
                <Link className="font-medium text-white hover:underline" href={`/inmuebles/${encodeURIComponent(listing.id)}`}>
                  /inmuebles/{listing.id}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Kpi label="Vistas" value={metrics?.metrics.views ?? 0} />
              <Kpi label="Solicitudes" value={metrics?.counts.leads_total ?? 0} />
              <Kpi label="Info" value={metrics?.counts.leads_info ?? 0} />
              <Kpi label="Visitas" value={metrics?.counts.leads_visita ?? 0} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {ok ? (
          <div className="mb-6 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-900">
            <p className="font-semibold">Guardado</p>
            <p className="pt-2 leading-6">Cambios aplicados correctamente.</p>
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pudo aplicar</p>
            <p className="pt-2 leading-6">{error}</p>
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-6">
            <Panel title="Publicación" subtitle="Controla si este inmueble aparece en el portal público.">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-700">
                  Estado:{" "}
                  <span className={published ? "font-semibold text-emerald-800" : "font-semibold text-amber-900"}>
                    {published ? "Publicado" : "Oculto"}
                  </span>
                </div>
                <form method="post" action="/api/admin/crm/publish">
                  <input type="hidden" name="listing_id" value={listing.id} />
                  <input type="hidden" name="published" value={published ? "0" : "1"} />
                  <input
                    type="hidden"
                    name="return_to"
                    value={`/admin/listings/${encodeURIComponent(listing.id)}`}
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    {published ? "Ocultar en portal" : "Publicar en portal"}
                  </button>
                </form>
                </div>
              </div>
              <p className="pt-3 text-xs text-slate-500">
                Requiere `CRM_PORTAL_ADMIN_TOKEN` configurado en `verifika2-web`.
              </p>
            </Panel>

            <Panel title="Documentos" subtitle="Checklist (títulos/estado) para owner portal.">
              <form method="post" action="/api/admin/documents/seed" className="flex gap-2">
                <input type="hidden" name="listing_id" value={listing.id} />
                <input type="hidden" name="return_to" value={`/admin/listings/${encodeURIComponent(listing.id)}`} />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Crear checklist base
                </button>
              </form>
              <div className="pt-4 grid gap-2">
                {documents.length === 0 ? (
                  <p className="text-sm text-slate-600">Aún no hay documentos.</p>
                ) : (
                  documents.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{d.title}</span>
                        <span className="text-xs text-slate-600">{d.status}</span>
                      </div>
                      {d.note ? <p className="pt-1 text-xs text-slate-600">{d.note}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Servicios de operación" subtitle="Servicios premium activados para esta compraventa o alquiler.">
              <div className="grid gap-2">
                {operationServices.length === 0 ? (
                  <p className="text-sm text-slate-600">No hay servicios activados para esta operación.</p>
                ) : (
                  operationServices.map((service) => (
                    <div key={service.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{serviceLabel(service.service)}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{statusLabel(service.status)}</span>
                      </div>
                      <p className="pt-1 text-xs text-slate-600">
                        {service.subject_type === "buyer" ? "Comprador" : "Propietario"} · {service.subject_contact || service.subject_id || "sin contacto"}
                      </p>
                      {service.note ? <p className="pt-1 text-xs text-slate-600">{service.note}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>

          <section className="lg:col-span-6 space-y-6">
            <Panel title="Compradores interesados" subtitle="Leads vinculados al inmueble y activación directa de servicios.">
              <div className="grid gap-2">
                {buyerLeads.length === 0 ? (
                  <p className="text-sm text-slate-600">Aún no hay compradores interesados.</p>
                ) : (
                  buyerLeads.map((lead) => (
                    <div key={lead.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{lead.name || lead.contact}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{lead.intent}</span>
                      </div>
                      <p className="pt-1 text-xs text-slate-600">{lead.contact} · {new Date(lead.created_at).toLocaleString("es-ES")}</p>
                      <form method="post" action="/api/admin/services/activate" className="pt-3 grid gap-2">
                        <input type="hidden" name="return_to" value={`/admin/listings/${encodeURIComponent(listing.id)}`} />
                        <input type="hidden" name="listing_id" value={listing.id} />
                        <input type="hidden" name="subject_type" value="buyer" />
                        <input type="hidden" name="subject_contact" value={lead.contact} />
                        <input type="hidden" name="subject_id" value={lead.id} />
                        <div className="grid gap-2 sm:grid-cols-3">
                          <select name="service" className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
                            <option value="purchase_tracking">Tracking</option>
                            <option value="document_verification_basic">Verificación básica</option>
                            <option value="document_verification_full">Dossier completo</option>
                          </select>
                          <select name="status" className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
                            <option value="active">Activo</option>
                            <option value="requested">Solicitado</option>
                            <option value="in_review">En revisión</option>
                            <option value="delivered">Entregado</option>
                          </select>
                          <button className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-semibold text-white hover:bg-[#0F2742]">
                            Activar servicio
                          </button>
                        </div>
                        <input name="note" placeholder="Nota interna" className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none" />
                      </form>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Hitos" subtitle="Timeline operativo (reserva, arras, firma...).">
              <form method="post" action="/api/admin/milestones/seed" className="flex gap-2">
                <input type="hidden" name="listing_id" value={listing.id} />
                <input type="hidden" name="return_to" value={`/admin/listings/${encodeURIComponent(listing.id)}`} />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Crear hitos base
                </button>
              </form>
              <div className="pt-4 grid gap-2">
                {milestones.length === 0 ? (
                  <p className="text-sm text-slate-600">Aún no hay hitos.</p>
                ) : (
                  milestones.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{m.title}</span>
                        <span className="text-xs text-slate-600">{m.status}</span>
                      </div>
                      {m.due_at ? (
                        <p className="pt-1 text-xs text-slate-600">
                          Vence: {new Date(m.due_at).toLocaleDateString("es-ES")}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Firma" subtitle="Solicitudes de firma vinculadas a la operación.">
              <div className="pt-2 grid gap-2">
                {signatures.length === 0 ? (
                  <p className="text-sm text-slate-600">Aún no hay solicitudes de firma.</p>
                ) : (
                  signatures.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{s.title}</span>
                        <span className="text-xs text-slate-600">{s.status}</span>
                      </div>
                      {s.external_url ? (
                        <p className="pt-1 text-xs text-slate-600">
                          URL: <span className="font-mono">{s.external_url}</span>
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Auditoría de servicios" subtitle="Historial de activación y cambios de estado.">
              <div className="grid gap-2">
                {serviceAudit.length === 0 ? (
                  <p className="text-sm text-slate-600">Aún no hay auditoría de servicios.</p>
                ) : (
                  serviceAudit.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{serviceLabel(item.service || "")}</span>
                        <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString("es-ES")}</span>
                      </div>
                      <p className="pt-1 text-xs text-slate-600">
                        {statusLabel(item.status || "")} · {item.actor || "admin"} · {item.subject_contact || "sin contacto"}
                      </p>
                      {item.note ? <p className="pt-1 text-xs text-slate-600">{item.note}</p> : null}
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>
        </div>
      </main>
    </div>
  );
}

function serviceLabel(value: string) {
  if (value === "purchase_tracking") return "Tracking de compraventa";
  if (value === "document_verification_basic") return "Verificación documental básica";
  if (value === "document_verification_full") return "Dossier documental completo";
  return value || "Servicio";
}

function statusLabel(value: string) {
  if (value === "requested") return "Solicitado";
  if (value === "active") return "Activo";
  if (value === "in_review") return "En revisión";
  if (value === "delivered") return "Entregado";
  if (value === "paused") return "Pausado";
  if (value === "cancelled") return "Cancelado";
  return value || "Sin estado";
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      <div className="pt-4">{children}</div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
      <p className="text-xs font-medium text-white/64">{label}</p>
      <p className="pt-1 text-lg font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}
