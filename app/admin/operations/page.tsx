import type { Metadata } from "next";
import Link from "next/link";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Admin · Operaciones",
  description: "Servicios activos por operación y archivo de datos QA.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type OperationService = {
  id: string;
  created_at: string;
  updated_at: string;
  listing_id: string;
  subject_type: string;
  subject_contact: string | null;
  subject_id: string | null;
  service: string;
  status: string;
  note: string | null;
  activated_by: string | null;
};

type OperationSummary = {
  total: number;
  open: number;
  tracking_open: number;
  verification_open: number;
  buyer_open: number;
  owner_open: number;
};

type QaSummary = {
  leads: number;
  buyers: number;
  owners: number;
  operation_services: number;
  consents: number;
};

function normalize(value: unknown) {
  return String(Array.isArray(value) ? value[0] : value ?? "").trim();
}

async function getServices(params: { status: string; service: string; subjectType: string }) {
  try {
    const query = new URLSearchParams();
    query.set("limit", "250");
    if (params.status) query.set("status", params.status);
    if (params.service) query.set("service", params.service);
    if (params.subjectType) query.set("subject_type", params.subjectType);
    const res = await leadHubFetch(`/v1/operation_services?${query.toString()}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { services?: OperationService[] };
    return Array.isArray(data.services) ? data.services : [];
  } catch {
    return [];
  }
}

async function getSummary(): Promise<OperationSummary | null> {
  try {
    const res = await leadHubFetch("/v1/operation_services/summary");
    if (!res.ok) return null;
    const data = (await res.json()) as { summary?: OperationSummary };
    return data.summary ?? null;
  } catch {
    return null;
  }
}

async function getQaSummary(): Promise<QaSummary | null> {
  try {
    const res = await leadHubFetch("/v1/qa/summary");
    if (!res.ok) return null;
    const data = (await res.json()) as { summary?: QaSummary };
    return data.summary ?? null;
  } catch {
    return null;
  }
}

export default async function AdminOperationsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) || {};
  const status = normalize(sp.status);
  const service = normalize(sp.service);
  const subjectType = normalize(sp.subject_type);
  const error = normalize(sp.error);
  const archived = normalize(sp.qa_archived) === "1";
  const [services, summary, qaSummary] = await Promise.all([
    getServices({ status, service, subjectType }),
    getSummary(),
    getQaSummary(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-medium text-white/64 hover:text-white">
              ← Volver a admin
            </Link>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Operaciones y servicios</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Vista central para controlar tracking, verificación documental y estados activos por inmueble, comprador o propietario.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/buyers"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Compradores
            </Link>
            <Link
              href="/admin/listings"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Inmuebles
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {archived ? (
          <div className="mb-6 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-950">
            <p className="font-semibold">Datos QA archivados.</p>
            <p className="pt-2 leading-6">
              Servicios: {normalize(sp.services) || "0"} · Compradores: {normalize(sp.buyers) || "0"} · Propietarios: {normalize(sp.owners) || "0"} · Leads: {normalize(sp.leads) || "0"}
            </p>
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pudo completar la acción.</p>
            <p className="pt-2 leading-6">{error}</p>
          </div>
        ) : null}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Metric label="Servicios" value={summary?.total ?? 0} />
          <Metric label="Abiertos" value={summary?.open ?? 0} />
          <Metric label="Tracking" value={summary?.tracking_open ?? 0} />
          <Metric label="Verificación" value={summary?.verification_open ?? 0} />
          <Metric label="Comprador" value={summary?.buyer_open ?? 0} />
          <Metric label="Propietario" value={summary?.owner_open ?? 0} />
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold tracking-tight">Filtro operativo</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Usa esta vista para revisar qué servicios están abiertos y a quién afectan.
                </p>
              </div>
              <form action="/admin/operations" className="grid gap-2 sm:grid-cols-4">
                <select name="status" defaultValue={status} className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
                  <option value="">Todos los estados</option>
                  <option value="requested">Solicitado</option>
                  <option value="active">Activo</option>
                  <option value="in_review">En revisión</option>
                  <option value="delivered">Entregado</option>
                  <option value="paused">Pausado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                <select name="service" defaultValue={service} className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
                  <option value="">Todos los servicios</option>
                  <option value="purchase_tracking">Tracking</option>
                  <option value="document_verification_basic">Verificación básica</option>
                  <option value="document_verification_full">Dossier completo</option>
                </select>
                <select name="subject_type" defaultValue={subjectType} className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
                  <option value="">Todos los sujetos</option>
                  <option value="buyer">Comprador</option>
                  <option value="owner">Propietario</option>
                </select>
                <button className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-semibold text-white hover:bg-[#0F2742]">
                  Filtrar
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm lg:col-span-4">
            <p className="text-sm font-semibold tracking-tight">Archivo QA</p>
            <p className="pt-2 text-sm leading-6 text-amber-900/90">
              Detectados: {qaSummary?.operation_services ?? 0} servicios, {qaSummary?.buyers ?? 0} compradores, {qaSummary?.owners ?? 0} propietarios, {qaSummary?.leads ?? 0} leads y {qaSummary?.consents ?? 0} consentimientos QA.
            </p>
            <form method="post" action="/api/admin/qa/archive" className="pt-4 grid gap-2">
              <input type="hidden" name="return_to" value="/admin/operations" />
              <input
                name="confirm"
                placeholder="ARCHIVE_QA"
                className="h-10 rounded-full border border-amber-300 bg-white px-3 text-xs outline-none"
              />
              <button className="inline-flex h-10 items-center justify-center rounded-full bg-amber-950 px-4 text-xs font-semibold text-white hover:bg-amber-900">
                Archivar QA
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-tight">Servicios por operación</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                {services.length} registros cargados desde Lead Hub.
              </p>
            </div>
            <Link href="/admin/listings" className="text-sm font-medium text-slate-700 hover:underline">
              Abrir inmuebles
            </Link>
          </div>

          <div className="pt-5 grid gap-3">
            {services.length === 0 ? (
              <p className="text-sm text-slate-600">No hay servicios con los filtros seleccionados.</p>
            ) : (
              services.map((item) => <ServiceRow key={item.id} item={item} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function ServiceRow({ item }: { item: OperationService }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{serviceLabel(item.service)}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
              {statusLabel(item.status)}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {item.subject_type === "buyer" ? "Comprador" : "Propietario"}
            </span>
          </div>
          <p className="pt-2 text-slate-700">{item.subject_contact || item.subject_id || "Sin contacto"}</p>
          <p className="pt-1 text-xs text-slate-600">
            Inmueble:{" "}
            <Link href={`/admin/listings/${encodeURIComponent(item.listing_id)}`} className="font-medium hover:underline">
              {item.listing_id}
            </Link>
            {" · "}Actualizado: {new Date(item.updated_at).toLocaleString("es-ES")}
          </p>
          {item.note ? <p className="pt-2 text-xs leading-5 text-slate-600">{item.note}</p> : null}
        </div>
        <Link
          href={`/admin/listings/${encodeURIComponent(item.listing_id)}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-semibold text-white hover:bg-[#0F2742]"
        >
          Abrir operación
        </Link>
      </div>
    </div>
  );
}

function serviceLabel(value: string) {
  if (value === "purchase_tracking") return "Tracking de compraventa";
  if (value === "document_verification_basic") return "Verificación básica";
  if (value === "document_verification_full") return "Dossier completo";
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

function statusClass(value: string) {
  if (value === "active" || value === "in_review") return "bg-emerald-50 text-emerald-800";
  if (value === "requested") return "bg-blue-50 text-blue-800";
  if (value === "delivered") return "bg-slate-100 text-slate-700";
  if (value === "paused" || value === "cancelled") return "bg-amber-50 text-amber-800";
  return "bg-white text-slate-700";
}
