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
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 py-10">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
            >
              ← Volver a admin
            </Link>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Leads</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Solicitudes de información y visitas. Cada lead queda registrado en el hub para trazabilidad.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/owners"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Owners
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">
            Recientes ({leads.length})
          </p>
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
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={href} className="font-semibold hover:underline">
          {lead.intent.toUpperCase()} · {lead.persona}
        </Link>
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
        <span className={isCrmError ? "font-semibold text-amber-900" : "font-medium"}>
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
    </div>
  );
}
