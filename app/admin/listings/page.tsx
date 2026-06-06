import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListings } from "@/lib/crmPortal";

export const metadata: Metadata = {
  title: "Admin · Inmuebles",
  description: "Listado operativo de inmuebles sincronizados con el CRM.",
};

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const listings = await fetchPortalListings({ limit: 200 }).catch(() => []);
  const certified = listings.filter((listing) => listing.certified).length;
  const cities = new Set(listings.map((listing) => listing.city).filter(Boolean)).size;

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
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Inmuebles del portal</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Selecciona una ficha para revisar publicación, métricas, checklist documental e hitos operativos.
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
              href="/admin/leads"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Total inmuebles" value={listings.length} />
          <SummaryTile label="Certificados" value={certified} />
          <SummaryTile label="Zonas activas" value={cities} />
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.length === 0 ? (
            <p className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm text-slate-600 shadow-sm">
              No hay inmuebles (o el CRM no responde). Revisa `CRM_ORIGIN`.
            </p>
          ) : (
            listings.map((l) => (
              <Link
                key={l.id}
                href={`/admin/listings/${encodeURIComponent(l.id)}`}
                className="group rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-tight">{l.title}</p>
                    <p className="pt-2 text-sm text-slate-600">{l.city}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      l.certified ? "bg-[#F2C14E]/30 text-[#5a4300]" : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {l.certified ? "Premium" : "Verificado"}
                  </span>
                </div>
                <p className="pt-5 text-2xl font-semibold tracking-tight">{l.priceLabel}</p>
                <div className="mt-4 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">Características</p>
                  <p className="pt-1 text-sm text-slate-700">{l.detailsShort}</p>
                </div>
                <p className="pt-4 text-sm font-medium group-hover:underline">Abrir gestión</p>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
