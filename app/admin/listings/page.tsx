import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListings } from "@/lib/crmPortal";

export const metadata: Metadata = {
  title: "Admin · Inmuebles",
  description: "Listado de inmuebles del CRM para acceso rápido (beta).",
};

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const listings = await fetchPortalListings({ limit: 200 }).catch(() => []);

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
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Inmuebles</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Selecciona un inmueble para revisar métricas y crear checklist/hitos en el hub.
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
              href="/admin/leads"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {listings.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hay inmuebles (o el CRM no responde). Revisa `CRM_ORIGIN`.
            </p>
          ) : (
            listings.map((l) => (
              <Link
                key={l.id}
                href={`/admin/listings/${encodeURIComponent(l.id)}`}
                className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm hover:border-slate-300"
              >
                <p className="text-sm font-semibold tracking-tight">{l.title}</p>
                <p className="pt-2 text-sm text-slate-600">{l.city}</p>
                <p className="pt-3 text-lg font-semibold tracking-tight">{l.priceLabel}</p>
                <p className="pt-3 text-xs text-slate-600">
                  {l.certified ? "Certificado" : "Verificado"} · {l.detailsShort}
                </p>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

