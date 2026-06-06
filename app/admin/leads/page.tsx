import type { Metadata } from "next";
import Link from "next/link";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Admin · Leads",
  description: "Leads recientes del portal (beta).",
};

export const dynamic = "force-dynamic";

type HubLead = {
  id: string;
  created_at: string;
  persona: string;
  intent: string;
  contact: string;
  name: string | null;
  listing_id: string | null;
  listing_title: string | null;
  listing_city: string | null;
  crm_status?: string | null;
  crm_error?: string | null;
};

async function getLeads(): Promise<HubLead[]> {
  try {
    const res = await leadHubFetch("/v1/leads/recent?limit=200");
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!data || typeof data !== "object") return [];
    const leads = (data as Record<string, unknown>).leads;
    return Array.isArray(leads) ? (leads as HubLead[]) : [];
  } catch {
    return [];
  }
}

export default async function LeadsAdminPage() {
  const leads = await getLeads();
  const crmErrors = leads.filter((lead) => lead.crm_status === "error").length;
  const visitLeads = leads.filter((lead) => lead.intent === "visita").length;
  const infoLeads = leads.filter((lead) => lead.intent === "info").length;
  const withListing = leads.filter((lead) => lead.listing_id).length;

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-white/64 hover:text-white"
            >
              ← Volver a admin
            </Link>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Leads comerciales</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Solicitudes de información y visitas con trazabilidad, inmueble asociado y estado de volcado al CRM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/owners"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Owners
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <LeadMetric label="Leads totales" value={leads.length} />
          <LeadMetric label="Solicitan visita" value={visitLeads} />
          <LeadMetric label="Piden información" value={infoLeads} />
          <LeadMetric label="Errores CRM" value={crmErrors} tone={crmErrors ? "warning" : "ok"} />
        </section>

        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-tight">Actividad reciente</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                {withListing} leads vinculados a inmueble y {leads.length - withListing} sin inmueble asociado.
              </p>
            </div>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-semibold text-slate-700">
              {leads.length} registros
            </span>
          </div>
          <div className="pt-4 grid gap-2">
            {leads.length === 0 ? (
              <p className="text-sm text-slate-600">No hay leads todavía.</p>
            ) : (
              leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function LeadRow({ lead }: { lead: HubLead }) {
  const href = lead.listing_id ? `/admin/listings/${encodeURIComponent(lead.listing_id)}` : "/admin";
  const crmStatus = String(lead.crm_status ?? "").trim() || "—";
  const crmError = String(lead.crm_error ?? "").trim();
  const isCrmError = crmStatus === "error";

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {lead.intent.toUpperCase()}
          </span>
          <Link href={href} className="font-semibold hover:underline">
            {lead.persona}
          </Link>
        </div>
        <span className="text-xs text-slate-500">
          {new Date(lead.created_at).toLocaleString("es-ES")}
        </span>
      </div>
      <div className="pt-1 text-slate-700">
        {lead.contact}
        {lead.name ? <span className="text-slate-500"> · {lead.name}</span> : null}
      </div>
      <div className="pt-1 text-xs text-slate-600">
        {lead.listing_title ? (
          <>
            {lead.listing_title}
            {lead.listing_city ? ` · ${lead.listing_city}` : ""}
          </>
        ) : (
          "Sin inmueble"
        )}
        {" · "}
        CRM:{" "}
        <span className={isCrmError ? "font-semibold text-amber-900" : "font-semibold text-emerald-800"}>
          {crmStatus}
        </span>
        {crmError ? <span className="text-slate-500"> · {crmError}</span> : null}
      </div>
      {isCrmError ? (
        <div className="pt-3">
          <form method="post" action="/api/admin/leads/retry" className="flex items-center gap-2">
            <input type="hidden" name="lead_id" value={lead.id} />
            <input type="hidden" name="return_to" value="/admin/leads" />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-medium text-white hover:bg-[#0F2742]"
            >
              Reintentar envío a CRM
            </button>
          </form>
        </div>
      ) : null}
      {lead.persona === "comprador" && lead.listing_id ? (
        <form method="post" action="/api/admin/services/activate" className="mt-3 grid gap-2 rounded-2xl border border-[color:var(--border)] bg-white p-3">
          <input type="hidden" name="return_to" value="/admin/leads" />
          <input type="hidden" name="listing_id" value={lead.listing_id} />
          <input type="hidden" name="subject_type" value="buyer" />
          <input type="hidden" name="subject_id" value={lead.id} />
          <input type="hidden" name="subject_contact" value={lead.contact} />
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <select name="service" className="h-9 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
              <option value="purchase_tracking">Tracking</option>
              <option value="document_verification_basic">Verificación básica</option>
              <option value="document_verification_full">Dossier completo</option>
            </select>
            <select name="status" className="h-9 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
              <option value="active">Activo</option>
              <option value="requested">Solicitado</option>
              <option value="in_review">En revisión</option>
              <option value="delivered">Entregado</option>
            </select>
            <button className="inline-flex h-9 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-medium text-white hover:bg-[#0F2742]">
              Activar
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function LeadMetric({ label, value, tone }: { label: string; value: number; tone?: "ok" | "warning" }) {
  const toneClass =
    tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : tone === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
        : "border-[color:var(--border)] bg-[color:var(--surface)]";
  return (
    <div className={`rounded-[24px] border p-5 shadow-sm ${toneClass}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="pt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
