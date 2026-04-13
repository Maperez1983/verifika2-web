import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListings } from "@/lib/crmPortal";

export const metadata: Metadata = {
  title: "Admin · Owners",
  description: "Genera códigos de propietario y vincúlalos a inmuebles (beta).",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function OwnersAdminPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const created = normalize(params.created) === "1";
  const code = normalize(params.code);
  const error = normalize(params.error);

  const listings = await fetchPortalListings({ limit: 120 }).catch(() => []);

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
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Owners</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Crea un código de acceso para el propietario y asigna el/los
              inmuebles que puede ver en el Owner Portal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/owner"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Owner portal
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Ver leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {created && code ? (
          <div className="mb-6 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-900">
            <p className="font-semibold">Código generado</p>
            <p className="pt-2 leading-6">
              Comparte este código con el propietario (solo acceso a sus inmuebles).
            </p>
            <p className="pt-3 text-lg font-semibold tracking-tight">{code}</p>
            <p className="pt-2 text-xs text-emerald-900/80">
              Acceso: <span className="font-medium">/owner</span> → pega el código.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pudo generar el código.</p>
            <p className="pt-2 leading-6 text-amber-900/90">{error}</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Nuevo código</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Selecciona 1+ inmuebles y genera el código automáticamente (evita colisiones).
              </p>
              <form method="post" action="/api/admin/owners/create" className="pt-6 grid gap-3">
                <textarea
                  name="listing_ids_raw"
                  placeholder="IDs de inmueble (opcional). Ej: 123, 456, 789"
                  className="min-h-[88px] w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <input
                  name="name"
                  placeholder="Nombre (opcional)"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <input
                  name="contact"
                  placeholder="Contacto (email/teléfono) (opcional)"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Generar código
                </button>
                <p className="text-xs leading-5 text-slate-500">
                  Puedes usar la lista de la derecha (checkboxes) o pegar los IDs aquí (separados por coma/espacios).
                </p>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-7">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Seleccionar inmuebles</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Marca los inmuebles que verá el propietario en su portal.
              </p>
              <form method="post" action="/api/admin/owners/create" className="pt-4 grid gap-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {listings.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No hay inmuebles disponibles (o el CRM no responde).
                    </p>
                  ) : (
                    listings.map((l) => (
                      <label
                        key={l.id}
                        className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm"
                      >
                        <input type="checkbox" name="listing_ids" value={l.id} className="mt-1" />
                        <span>
                          <span className="font-semibold">{l.title}</span>
                          <span className="text-slate-600"> · {l.city}</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    name="name"
                    placeholder="Nombre (opcional)"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    name="contact"
                    placeholder="Contacto (opcional)"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Generar código con inmuebles marcados
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
