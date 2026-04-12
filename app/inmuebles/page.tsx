import type { Metadata } from "next";
import Link from "next/link";
import { mockListings, type Listing } from "@/lib/listings";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Inmuebles",
  description:
    "Explora inmuebles verificados documentalmente en Verifika2. Portal público con evidencias y trazabilidad por anuncio.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const q = normalize(params.q).toLowerCase();
  const operation = normalize(params.operacion) as Listing["operation"] | "";
  const city = normalize(params.ciudad).toLowerCase();
  const certifiedOnly = normalize(params.certificado) === "1";

  const filtered = mockListings.filter((listing) => {
    if (certifiedOnly && !listing.certified) return false;
    if (operation && listing.operation !== operation) return false;
    if (city && !listing.city.toLowerCase().includes(city)) return false;
    if (q) {
      const hay = `${listing.title} ${listing.city} ${listing.propertyType} ${listing.operation}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inmuebles</h1>
            <p className="pt-1 text-sm text-slate-600">
              Todos los anuncios del portal están{" "}
              <span className="font-medium">verificados</span>. Puedes filtrar
              por <span className="font-medium">certificados</span> (premium).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Volver
            </Link>
            <a
              href="https://app.verifika2.com"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Acceso
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <form
            method="get"
            className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 md:col-span-1"
          >
            <p className="text-sm font-semibold">Filtros</p>
            <div className="pt-4 space-y-3 text-sm text-slate-700">
              <div>
                <label className="text-xs font-medium text-slate-600" htmlFor="q">
                  Búsqueda
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={normalize(params.q)}
                  placeholder="Madrid, ático, 3 habitaciones…"
                  className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    className="text-xs font-medium text-slate-600"
                    htmlFor="operacion"
                  >
                    Operación
                  </label>
                  <select
                    id="operacion"
                    name="operacion"
                    defaultValue={operation}
                    className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Todas</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>
                <div>
                  <label
                    className="text-xs font-medium text-slate-600"
                    htmlFor="ciudad"
                  >
                    Ciudad
                  </label>
                  <input
                    id="ciudad"
                    name="ciudad"
                    defaultValue={normalize(params.ciudad)}
                    placeholder="Madrid"
                    className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <input
                  type="checkbox"
                  name="certificado"
                  value="1"
                  defaultChecked={certifiedOnly}
                />
                <span className="text-sm">Solo certificados (premium)</span>
              </label>
            </div>
            <div className="pt-4 flex gap-2">
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Aplicar
              </button>
              <Link
                href="/inmuebles"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Reset
              </Link>
            </div>
            <div className="pt-4 text-xs text-slate-600">
              Resultados: <span className="font-medium">{filtered.length}</span>
            </div>
          </form>

          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-sm">
              <p className="text-sm text-slate-600">
                Mostrando{" "}
                <span className="font-semibold text-[color:var(--foreground)]">
                  {filtered.length}
                </span>{" "}
                resultados verificados
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  Verificados
                </span>
                <Link
                  href="/verificacion"
                  className="text-xs font-medium text-slate-600 hover:text-[color:var(--foreground)]"
                >
                  ¿Qué significa?
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/inmuebles/${listing.id}`}
                  className="group rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm hover:border-slate-300"
                >
                  <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(11,29,51,0.08),rgba(242,193,78,0.22))]">
                    <div className="flex h-full items-end justify-between p-4">
                      <span className="rounded-full bg-[color:var(--surface)]/85 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
                        {listing.propertyType.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-[color:var(--surface)]/85 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
                        {listing.operation === "venta" ? "VENTA" : "ALQUILER"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold tracking-tight">
                      {listing.title}
                    </p>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {listing.certified ? (
                        <span className="rounded-full bg-[color:var(--brand)] px-2 py-1 text-xs font-medium text-[color:var(--brand-foreground)]">
                          Certificado
                        </span>
                      ) : null}
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                        Verificado
                      </span>
                    </div>
                  </div>
                  <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
                  <p className="pt-3 text-xl font-semibold tracking-tight">
                    {listing.priceLabel}
                  </p>
                  <p className="pt-2 text-sm text-slate-600">
                    {listing.detailsShort}
                  </p>
                  <p className="pt-3 text-xs text-slate-600">
                    Verificado:{" "}
                    <span className="font-medium">{listing.verifiedAt}</span>
                  </p>
                  <p className="pt-4 text-sm font-medium text-[color:var(--foreground)] group-hover:underline">
                    Ver ficha
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <ChatWidget scope="portal" defaultPersona="comprador" />
    </div>
  );
}
