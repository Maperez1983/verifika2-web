import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBuyerSession } from "@/lib/buyerSessionServer";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Área comprador",
  description: "Panel privado del comprador para solicitudes, visitas y ofertas.",
};

export const dynamic = "force-dynamic";

type BuyerLead = {
  id: string;
  created_at: string;
  intent: string;
  contact: string;
  name: string | null;
  note: string | null;
  listing_id: string | null;
  listing_title: string | null;
  listing_city: string | null;
  status: string;
  scheduled_at: string | null;
  outcome: string | null;
  outcome_note: string | null;
};

async function getBuyerLeads(contact: string): Promise<BuyerLead[]> {
  try {
    const res = await leadHubFetch(`/v1/buyers/leads?contact=${encodeURIComponent(contact)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { leads?: BuyerLead[] };
    return Array.isArray(data.leads) ? data.leads : [];
  } catch {
    return [];
  }
}

function statusLabel(status: string) {
  if (status === "contacted") return "Contactado";
  if (status === "scheduled") return "Cita";
  if (status === "done") return "Finalizado";
  if (status === "rejected") return "Descartado";
  return "Nuevo";
}

function pill(status: string) {
  if (status === "scheduled" || status === "done") return "bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

export default async function BuyerDashboard() {
  const session = await getBuyerSession();
  if (!session) redirect("/comprador/acceso");

  const leads = await getBuyerLeads(session.contact);
  const visits = leads.filter((lead) => lead.intent === "visita");
  const offers = leads.filter((lead) => lead.intent === "oferta" || lead.outcome === "oferta");
  const active = leads.filter((lead) => ["new", "contacted", "scheduled"].includes(lead.status || "new"));

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Área comprador
            </p>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">
              Mis solicitudes
            </h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Seguimiento de inmuebles consultados, visitas solicitadas, ofertas y estado de cada contacto.
            </p>
          </div>
          <Link
            href="/inmuebles"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Ver inmuebles
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] p-6 text-white shadow-sm">
          <div className="grid gap-3 sm:grid-cols-4">
            <HeroStat label="Solicitudes" value={leads.length} />
            <HeroStat label="Activas" value={active.length} />
            <HeroStat label="Visitas" value={visits.length} />
            <HeroStat label="Ofertas" value={offers.length} />
          </div>
        </section>

        <div className="grid gap-4">
          {leads.length === 0 ? (
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-sm">
              <p className="text-lg font-semibold tracking-tight">Sin solicitudes todavía</p>
              <p className="mx-auto max-w-xl pt-3 text-sm leading-6 text-slate-600">
                Cuando solicites información, una visita u oferta desde el portal, aparecerá aquí.
              </p>
              <div className="pt-5">
                <Link
                  href="/inmuebles"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Buscar inmuebles
                </Link>
              </div>
            </div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>
      </main>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/10 px-4 py-3">
      <p className="text-xs font-medium text-white/64">{label}</p>
      <p className="pt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function LeadCard({ lead }: { lead: BuyerLead }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill(lead.status)}`}>
              {statusLabel(lead.status)}
            </span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {lead.intent}
            </span>
          </div>
          <h2 className="pt-4 text-lg font-semibold tracking-tight">
            {lead.listing_title || "Inmueble solicitado"}
          </h2>
          <p className="pt-2 text-sm text-slate-600">
            {lead.listing_city || "Ubicación bajo solicitud"} · {new Date(lead.created_at).toLocaleString("es-ES")}
          </p>
          {lead.scheduled_at ? (
            <p className="pt-3 text-sm text-slate-700">
              Cita: <span className="font-medium">{new Date(lead.scheduled_at).toLocaleString("es-ES")}</span>
            </p>
          ) : null}
          {lead.outcome || lead.outcome_note ? (
            <p className="pt-2 text-sm text-slate-700">
              Resultado: <span className="font-medium">{lead.outcome || "Pendiente"}</span>
              {lead.outcome_note ? ` · ${lead.outcome_note}` : ""}
            </p>
          ) : null}
          {lead.note ? (
            <p className="pt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">
              {lead.note}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:w-[180px]">
          {lead.listing_id ? (
            <Link
              href={`/inmuebles/${encodeURIComponent(lead.listing_id)}`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Ver anuncio
            </Link>
          ) : null}
          <Link
            href={`/interes${lead.listing_id ? `?listing=${encodeURIComponent(lead.listing_id)}&tipo=info` : ""}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
}
