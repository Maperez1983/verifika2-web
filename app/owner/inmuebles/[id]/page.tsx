import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockListingsById } from "@/lib/listings";
import { leadHubFetch } from "@/lib/leadHub";

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

export default async function OwnerListingPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = (await searchParams) || {};
  const tab = normalize(sp.tab) || "resumen";

  const listing = mockListingsById[id];
  if (!listing) notFound();

  const summary = await getSummary(listing.id);
  const leads = tab === "leads" ? await getLeads(listing.id) : [];
  const visits = tab === "visitas" ? await getLeads(listing.id, "visita") : [];
  const documents = tab === "docs" ? await getDocuments(listing.id) : [];

  const views = summary?.metrics?.views ?? 0;
  const leadsTotal = summary?.counts?.leads_total ?? 0;
  const leadsInfo = summary?.counts?.leads_info ?? 0;
  const leadsVisits = summary?.counts?.leads_visita ?? 0;

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
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
            <Tab href={`/owner/inmuebles/${listing.id}?tab=docs`} active={tab === "docs"}>
              Documentos
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

        {tab === "docs" ? (
          <DocumentsSection
            listingId={listing.id}
            documents={documents}
            returnTo={`/owner/inmuebles/${listing.id}?tab=docs`}
          />
        ) : null}

        {tab === "firma" ? (
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Firma digital</p>
            <p className="pt-3 text-sm leading-6 text-slate-600">
              Integración prevista con firma electrónica (DocuSign/Dropbox Sign)
              para reservar, arras y anexos. En esta beta, dejamos preparado el
              flujo y la trazabilidad, pero no se firma todavía.
            </p>
            <div className="pt-5 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
              <p className="text-sm font-semibold">Siguiente fase</p>
              <ul className="pt-3 space-y-2 text-sm text-slate-700">
                <li>1) Plantillas por tipo de operación (venta/alquiler).</li>
                <li>2) Envío para firma + auditoría (IP, fecha, hash).</li>
                <li>3) Guardado automático en repositorio documental.</li>
              </ul>
            </div>
          </div>
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
                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
              />
              <label className="text-xs font-medium text-slate-600" htmlFor={`note_${lead.id}`}>
                Nota (opcional)
              </label>
              <input
                id={`note_${lead.id}`}
                name="outcome_note"
                placeholder="Ej: Confirma asistencia, feedback…"
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
