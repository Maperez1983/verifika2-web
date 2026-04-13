import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPortalListing } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";
import { getOwnerSession } from "@/lib/ownerSessionServer";
import { redirect } from "next/navigation";

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
  counts: { leads_total: number; leads_info: number; leads_visita: number };
};

const normalize = (value: unknown) => String(value ?? "").trim();

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
  const sp = (await searchParams) || {};
  const tab = normalize(sp.tab) || "resumen";

  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();
  if (!session.listingIds.includes(listing.id)) notFound();

  const summary = await getSummary(listing.id);
  const leads = tab === "leads" ? await getLeads(listing.id) : [];
  const visits = tab === "visitas" ? await getLeads(listing.id, "visita") : [];
  const agenda = tab === "agenda" ? await getLeads(listing.id, "visita") : [];
  const documents = tab === "docs" ? await getDocuments(listing.id) : [];
  const milestones = tab === "hitos" ? await getMilestones(listing.id) : [];
  const signatures = tab === "firma" ? await getSignatures(listing.id) : [];

  const views = summary?.metrics?.views ?? 0;
  const leadsTotal = summary?.counts?.leads_total ?? 0;
  const leadsInfo = summary?.counts?.leads_info ?? 0;
  const leadsVisits = summary?.counts?.leads_visita ?? 0;

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
            <h1 className="pt-3 text-2xl font-semibold tracking-tight">
              {listing.title}
            </h1>
            <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi label="Vistas" value={views} />
            <Kpi label="Solicitudes" value={leadsTotal} />
            <Kpi label="Info" value={leadsInfo} />
            <Kpi label="Visitas" value={leadsVisits} />
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
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">
                  Qué se controla aquí
                </p>
                <div className="pt-6 grid gap-3 sm:grid-cols-2">
                  <Card title="Estadísticas" desc="Vistas, solicitudes, visitas y evolución." />
                  <Card title="Visitas" desc="Solicitudes y resultado de cada visita." />
                  <Card title="Documentación" desc="Checklist y estado por documento." />
                  <Card title="Trazabilidad" desc="Quién pidió qué y cuándo, sin perder contexto." />
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-4">
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
                    href={`/owner/inmuebles/${listing.id}?tab=docs`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Ver documentos
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
      </main>
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
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill(lead.status)}`}>
              {lead.status}
            </span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {lead.intent}
            </span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {lead.persona}
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
