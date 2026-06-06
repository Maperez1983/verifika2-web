import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListings } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Admin · Owners",
  description: "Genera accesos de propietario y vincúlalos a inmuebles reales.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

type AdminOwner = {
  id: string;
  created_at: string;
  name: string | null;
  contact: string | null;
  listing_ids: string[];
  services: string[];
  status: string;
};

async function getOwners(q: string): Promise<AdminOwner[]> {
  try {
    const path = `/v1/owners?limit=80${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    const res = await leadHubFetch(path);
    if (!res.ok) return [];
    const data = (await res.json()) as { owners?: AdminOwner[] };
    return Array.isArray(data.owners) ? data.owners : [];
  } catch {
    return [];
  }
}

export default async function OwnersAdminPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const created = normalize(params.created) === "1";
  const code = normalize(params.code);
  const error = normalize(params.error);
  const q = normalize(params.q);

  const [listings, owners] = await Promise.all([
    fetchPortalListings({ limit: 120 }).catch(() => []),
    getOwners(q),
  ]);
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));

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
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Accesos de propietario</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Genera un código privado y asigna exactamente los inmuebles que el propietario podrá consultar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/owner"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Portal propietario
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Ver leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <OwnerStep index="01" title="Identifica al propietario" desc="Nombre y contacto para trazabilidad interna." />
          <OwnerStep index="02" title="Selecciona inmuebles" desc="El acceso queda limitado a las fichas marcadas." />
          <OwnerStep index="03" title="Entrega el código" desc="El propietario entra en /owner y consulta su dashboard." />
        </section>

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
              <p className="text-sm font-semibold tracking-tight">Código manual</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Úsalo si ya conoces los IDs o necesitas generar un acceso rápido sin navegar la lista.
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
                <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <input type="checkbox" name="services" value="purchase_tracking" className="mt-1" />
                    <span>
                      <span className="block font-semibold">Añadir tracking de compraventa</span>
                      <span className="block pt-1 text-xs leading-5 text-amber-900/80">
                      Habilitación interna: reserva, documentación, financiación, arras, notaría y cierre.
                      </span>
                    </span>
                  </label>
                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Generar acceso privado
                </button>
                <p className="text-xs leading-5 text-slate-500">
                  Puedes usar la lista de la derecha o pegar IDs separados por coma/espacios.
                </p>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-7">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold tracking-tight">Seleccionar inmuebles</p>
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Marca las fichas que verá el propietario en su portal.
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-semibold text-slate-700">
                  {listings.length} disponibles
                </span>
              </div>
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
                        className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-white"
                      >
                        <input type="checkbox" name="listing_ids" value={l.id} className="mt-1" />
                        <span>
                          <span className="block font-semibold">{l.title}</span>
                          <span className="block pt-1 text-xs text-slate-600">{l.city} · {l.priceLabel}</span>
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
                <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <input type="checkbox" name="services" value="purchase_tracking" className="mt-1" />
                    <span>
                      <span className="block font-semibold">Añadir tracking de compraventa</span>
                      <span className="block pt-1 text-xs leading-5 text-amber-900/80">
                      Solo aparece en el portal privado cuando administración lo habilita.
                      </span>
                    </span>
                  </label>
                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Generar acceso con inmuebles marcados
                </button>
              </form>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-tight">Propietarios existentes</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Revisa accesos ya creados, inmuebles asignados y activa tracking por operación.
              </p>
            </div>
            <form className="flex gap-2" action="/admin/owners">
              <input
                name="q"
                defaultValue={q}
                placeholder="Buscar propietario/contacto"
                className="h-10 w-full min-w-0 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400 sm:w-72"
              />
              <button className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]">
                Buscar
              </button>
            </form>
          </div>
          <div className="pt-5 grid gap-3">
            {owners.length === 0 ? (
              <p className="text-sm text-slate-600">No hay propietarios para esta búsqueda.</p>
            ) : (
              owners.map((owner) => <OwnerRow key={owner.id} owner={owner} listingById={listingById} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function OwnerStep({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
      <p className="pt-2 text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function OwnerRow({
  owner,
  listingById,
}: {
  owner: AdminOwner;
  listingById: Map<string, { id: string; title: string; city?: string; priceLabel?: string }>;
}) {
  const listingIds = Array.isArray(owner.listing_ids) ? owner.listing_ids : [];
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{owner.name || "Propietario sin nombre"}</p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{owner.status}</span>
          </div>
          <p className="pt-1 text-slate-600">{owner.contact || "Sin contacto registrado"}</p>
          <div className="pt-2 grid gap-1 text-xs text-slate-600">
            {listingIds.map((id) => {
              const listing = listingById.get(id);
              return (
                <span key={id}>
                  {listing ? listing.title : id}
                  {listing?.city ? ` · ${listing.city}` : ""}
                </span>
              );
            })}
          </div>
        </div>

        <form method="post" action="/api/admin/services/activate" className="grid gap-2 lg:min-w-[390px]">
          <input type="hidden" name="return_to" value="/admin/owners" />
          <input type="hidden" name="subject_type" value="owner" />
          <input type="hidden" name="subject_id" value={owner.id} />
          <input type="hidden" name="subject_contact" value={owner.contact || ""} />
          <div className="grid gap-2 sm:grid-cols-2">
            <select name="listing_id" required className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
              <option value="">Inmueble asignado</option>
              {listingIds.map((id) => {
                const listing = listingById.get(id);
                return (
                  <option key={id} value={id}>
                    {listing ? listing.title : id}
                  </option>
                );
              })}
            </select>
            <select name="status" className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none">
              <option value="active">Tracking activo</option>
              <option value="in_review">En seguimiento</option>
              <option value="delivered">Cierre entregado</option>
              <option value="paused">Pausado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <input type="hidden" name="service" value="purchase_tracking" />
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              name="note"
              placeholder="Nota interna opcional"
              className="h-10 rounded-full border border-[color:var(--border)] bg-white px-3 text-xs outline-none"
            />
            <button className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-xs font-semibold text-white hover:bg-[#0F2742]">
              Activar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
