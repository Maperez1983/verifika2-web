import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPortalListing } from "@/lib/crmPortal";
import ChatWidget from "@/components/chat/ChatWidget";
import ViewTracker from "@/components/track/ViewTracker";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";
import ListingCover from "@/components/listings/ListingCover";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) return { title: "Inmueble" };
  return {
    title: listing.title,
    description: `${listing.city} · ${listing.priceLabel} · Verificado`,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="portal" showBack backHref="/inmuebles" backLabel="Inmuebles" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ListingCover
                id={listing.id}
                src={listing.photo}
                title={listing.title}
                location={listing.city}
                label={listing.certified ? "Certificado" : "Verificado"}
              />
            </div>
            <div className="flex flex-col justify-between p-6 lg:col-span-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    Verificado
                  </span>
                  {listing.certified ? (
                    <span className="rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-medium text-[color:var(--brand-foreground)]">
                      Certificado
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-medium text-slate-600">
                    {listing.operation === "alquiler" ? "Alquiler" : "Venta"}
                  </span>
                </div>
                <h1 className="pt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                  {listing.title}
                </h1>
                <p className="pt-3 text-sm text-slate-600">{listing.city}</p>
                <p className="pt-6 text-4xl font-semibold tracking-tight">
                  {listing.priceLabel}
                </p>
              </div>
              <div className="pt-6 grid gap-2 sm:grid-cols-2">
                <Link
                  href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=visita&next=${encodeURIComponent(`/inmuebles/${listing.id}`)}`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Pedir visita
                </Link>
                <Link
                  href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&next=${encodeURIComponent(`/inmuebles/${listing.id}`)}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                >
                  Solicitar info
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Descripción
                </p>
                <p className="pt-3 text-base leading-7 text-slate-700">
                  {listing.description}
                </p>
                <div className="pt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {listing.details.slice(0, 6).map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm font-medium text-slate-800"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                  <p className="text-sm font-semibold">Ubicación</p>
                  <p className="pt-2 text-sm text-slate-600">
                    {listing.city}
                  </p>
                  <div className="mt-4 aspect-[16/10] rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]" />
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                  <p className="text-sm font-semibold">Interés del comprador</p>
                  <p className="pt-2 text-sm text-slate-600">
                    Solicita información o una visita. La petición queda registrada para que el equipo pueda responder con contexto.
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
                  Información revisada antes de publicar para reducir dudas antes de visitar.
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
      <PublicFooter />
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
