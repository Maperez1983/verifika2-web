import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockListingsById } from "@/lib/listings";
import { fetchPortalListing } from "@/lib/crmPortal";
import ChatWidget from "@/components/chat/ChatWidget";
import ViewTracker from "@/components/track/ViewTracker";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = mockListingsById[id];
  if (!listing) return { title: "Inmueble" };
  return {
    title: listing.title,
    description: `${listing.city} · ${listing.priceLabel} · Verificado`,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = (await fetchPortalListing(id)) || mockListingsById[id];
  if (!listing) notFound();

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 py-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/inmuebles"
              className="w-fit text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
            >
              ← Volver a inmuebles
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              {listing.title}
            </h1>
            <p className="text-sm text-slate-600">{listing.city}</p>
          </div>
          <div className="flex items-center gap-2">
            {listing.certified ? (
              <span className="rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-medium text-[color:var(--brand-foreground)]">
                Certificado
              </span>
            ) : null}
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              Verificado
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(11,29,51,0.08),rgba(242,193,78,0.22))]">
                    <div className="flex h-full items-end justify-between p-5">
                      <div className="rounded-2xl bg-[color:var(--surface)]/85 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur">
                        Galería (demo)
                      </div>
                      <div className="rounded-2xl bg-[color:var(--surface)]/85 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur">
                        {listing.propertyType.toUpperCase()} ·{" "}
                        {listing.operation.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <p className="text-3xl font-semibold tracking-tight">
                    {listing.priceLabel}
                  </p>
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    {listing.description}
                  </p>
                  <div className="pt-5 grid gap-2">
                    {listing.details.slice(0, 5).map((detail) => (
                      <div
                        key={detail}
                        className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm text-slate-800"
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                  <p className="text-sm font-semibold">Ubicación</p>
                  <p className="pt-2 text-sm text-slate-600">
                    {listing.city} · mapa/zonas (próximamente)
                  </p>
                  <div className="mt-4 aspect-[16/10] rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]" />
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                  <p className="text-sm font-semibold">Interés del comprador</p>
                  <p className="pt-2 text-sm text-slate-600">
                    Guardar, alertas y solicitud de visita/información. En la
                    siguiente fase, cada solicitud entra al CRM con trazabilidad.
                  </p>
                  <div className="pt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&next=${encodeURIComponent(`/inmuebles/${listing.id}`)}`}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                    >
                      Solicitar info
                    </Link>
                    <Link
                      href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=visita&next=${encodeURIComponent(`/inmuebles/${listing.id}`)}`}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                    >
                      Pedir visita
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold">Verificación Verifika2</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Evidencias visibles para reducir inseguridad jurídica.
                </p>
                <div className="pt-4 space-y-2 text-sm text-slate-700">
                  <Item label="Titularidad / nota simple" status="OK" tone="ok" />
                  <Item label="Certificado energético" status="OK" tone="ok" />
                  <Item label="Datos del anuncio" status="OK" tone="ok" />
                </div>
                <p className="pt-4 text-xs text-slate-600">
                  Verificado:{" "}
                  <span className="font-medium">{listing.verifiedAt}</span>
                </p>
                <div className="pt-4 flex gap-2">
                  <Link
                    href="/verificacion"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Qué significa
                  </Link>
                  <Link
                    href="/certificacion"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-medium text-[color:var(--brand-foreground)] hover:opacity-90"
                  >
                    Premium
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold">Contacto</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  En esta fase, te llevamos al formulario para registrar la solicitud con trazabilidad.
                </p>
                <form
                  method="get"
                  action="/interes"
                  className="pt-4 grid gap-2"
                >
                  <input type="hidden" name="listing" value={listing.id} />
                  <input type="hidden" name="tipo" value="contacto" />
                  <input type="hidden" name="next" value={`/inmuebles/${listing.id}`} />
                  <input
                    name="nombre"
                    placeholder="Nombre"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="submit"
                    className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <ChatWidget
        scope="listing"
        defaultPersona="comprador"
        listing={{
          id: listing.id,
          title: listing.title,
          city: listing.city,
          operation: listing.operation,
          verifiedAt: listing.verifiedAt,
          certified: listing.certified,
        }}
      />
      <ViewTracker listingId={listing.id} />
    </div>
  );
}

function Item({
  label,
  status,
  tone,
}: {
  label: string;
  status: string;
  tone: "ok" | "warn";
}) {
  const pill =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800"
      : "bg-amber-50 text-amber-800";
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
      <span className="text-sm">{label}</span>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${pill}`}>
        {status}
      </span>
    </div>
  );
}
