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

export default async function AdminListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();
  const published = Boolean((listing as { published?: boolean }).published);

  const metrics = await getMetrics(listing.id);
  const [documents, milestones, signatures] = await Promise.all([
    getDocs(listing.id),
    getMilestones(listing.id),
    getSignatures(listing.id),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/admin/listings"
            className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
          >
            ← Volver a inmuebles
          </Link>
          <div className="pt-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1>
              <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
              <p className="pt-2 text-sm text-slate-600">
                Portal:{" "}
                <Link className="font-medium hover:underline" href={`/inmuebles/${encodeURIComponent(listing.id)}`}>
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
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-6">
            <Panel title="Publicación" subtitle="Controla si este inmueble aparece en el portal público.">
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
          </section>

          <section className="lg:col-span-6 space-y-6">
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

            <Panel title="Firma" subtitle="Solicitudes de firma (placeholder).">
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
          </section>
        </div>
      </main>
    </div>
  );
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
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-1 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
