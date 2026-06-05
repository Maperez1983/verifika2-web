import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPortalListing } from "@/lib/crmPortal";
import type { Listing } from "@/lib/listings";
import ChatWidget from "@/components/chat/ChatWidget";
import ViewTracker from "@/components/track/ViewTracker";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";
import ListingCover from "@/components/listings/ListingCover";
import AgencyBadge from "@/components/listings/AgencyBadge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) return { title: "Inmueble" };
  const canonical = `/inmuebles/${listing.id}`;
  const image = listing.photo || undefined;
  return {
    title: listing.title,
    description: `${listing.city} · ${listing.priceLabel} · Publica Grupo Modernia. Verifika2 revisa la información del anuncio.`,
    alternates: { canonical },
    openGraph: {
      title: listing.title,
      description: `${listing.priceLabel} · ${listing.detailsShort}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await fetchPortalListing(id).catch(() => null);
  if (!listing) notFound();
  const locationLabel = [listing.address, listing.zone, listing.city, listing.province]
    .filter(Boolean)
    .join(", ");
  const hasCoordinates = typeof listing.lat === "number" && typeof listing.lon === "number";
  const mapHref = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lon}#map=16/${listing.lat}/${listing.lon}`
    : null;
  const jsonLd = buildListingJsonLd(listing);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <div className="grid gap-3 p-5 sm:grid-cols-3">
                <HeroTrust title="Anuncio revisado" desc="Datos publicados con control previo." />
                <HeroTrust title="Dossier disponible" desc="Documentación bajo solicitud." />
                <HeroTrust title="Seguimiento privado" desc="Visitas y ofertas trazables." />
              </div>
            </div>
            <div className="flex flex-col justify-between p-6 lg:col-span-5">
              <div>
                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                    <AgencyBadge
                      name={listing.agencyName}
                      logo={listing.agencyLogo}
                    />
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">
                      Verifica
                    </p>
                    <p className="text-sm font-semibold text-emerald-900">
                      Verifika2
                    </p>
                  </div>
                </div>
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
                <p className="pt-3 text-sm text-slate-600">
                  {[listing.zone, listing.city].filter(Boolean).join(", ") || listing.city}
                </p>
                <p className="pt-6 text-4xl font-semibold tracking-tight">
                  {listing.priceLabel}
                </p>
                <p className="pt-4 text-sm leading-6 text-slate-600">
                  Publicado por Grupo Modernia con la información del anuncio revisada por Verifika2.
                </p>
                <div className="mt-5 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
                  <DecisionSignal text="Revisión documental previa" />
                  <DecisionSignal text="Interés conectado al CRM" />
                  <DecisionSignal text="Seguimiento privado comprador" />
                  <DecisionSignal text="Reporte visible para propietario" />
                </div>
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
              <p className="pt-3 text-xs leading-5 text-slate-500">
                Al solicitar información se registra tu interés y podrás seguir la operación desde el área comprador si recibes código.
              </p>
            </div>
          </div>
        </section>

        {listing.photos && listing.photos.length > 1 ? (
          <section className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {listing.photos.slice(1, 7).map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="aspect-[4/3] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)]"
              >
                {/* CRM photos may come from external upload URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`${listing.title} foto ${index + 2}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </section>
        ) : null}

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
                    {locationLabel || listing.city}
                  </p>
                  <div className="mt-4 flex aspect-[16/10] flex-col items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-center">
                    <p className="text-sm font-semibold">
                      {hasCoordinates ? "Ubicación aproximada" : "Ubicación exacta bajo solicitud"}
                    </p>
                    <p className="pt-2 text-xs leading-5 text-slate-600">
                      {hasCoordinates
                        ? "Consulta el entorno antes de pedir visita. La dirección exacta se confirma con el equipo comercial."
                        : "Mostramos la zona pública disponible. Grupo Modernia confirma la dirección al gestionar la visita."}
                    </p>
                    {mapHref ? (
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
                      >
                        Ver mapa
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                  <p className="text-sm font-semibold">Interés del comprador</p>
                  <p className="pt-2 text-sm text-slate-600">
                    Solicita visita, condiciones u oferta. La petición entra con contexto del inmueble para que el equipo responda mejor.
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

              <div className="pt-6">
                <div className="rounded-3xl border border-[#d8e0ea] bg-[#0B1D33] p-6 text-white">
                  <p className="text-sm font-semibold text-[#F2C14E]">Antes de decidir</p>
                  <p className="pt-2 max-w-3xl text-sm leading-6 text-white/72">
                    Puedes pedir documentación, solicitar verificación adicional o dejar una consulta concreta. La operación queda trazada para que no se pierda información entre visitas, mensajes y llamadas.
                  </p>
                  <div className="pt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&next=${encodeURIComponent(`/inmuebles/${listing.id}`)}`}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
                    >
                      Pedir documentación
                    </Link>
                    <Link
                      href="/compradores"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/16"
                    >
                      Cómo funciona comprador
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
                  Verifika2 revisa la consistencia del anuncio y deja trazabilidad del interés generado. La revisión no sustituye el asesoramiento legal, pero reduce incertidumbre antes de avanzar.
                </p>
                <div className="pt-4 space-y-2 text-sm text-slate-700">
                  {(listing.verificationChecks || []).map((check) => (
                    <Item
                      key={check.label}
                      label={check.label}
                      status={check.status === "ok" ? "OK" : "Revisar"}
                      tone={check.status === "ok" ? "ok" : "warn"}
                    />
                  ))}
                </div>
                <p className="pt-4 text-xs text-slate-600">
                  Verificado:{" "}
                  <span className="font-medium">{listing.verifiedAt}</span>
                </p>
                <div className="mt-4 rounded-2xl bg-[color:var(--surface-2)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Dossier</p>
                  <p className="pt-2 text-xs leading-5 text-slate-600">
                    Solicita la documentación disponible antes de reservar o formalizar una oferta.
                  </p>
                </div>
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
                <p className="text-sm font-semibold">Lead comercial</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Deja teléfono y preferencia de contacto para priorizar la respuesta sobre este inmueble.
                </p>
                <form
                  method="get"
                  action="/interes"
                  className="pt-4 grid gap-2"
                >
                  <input type="hidden" name="listing" value={listing.id} />
                  <input type="hidden" name="tipo" value="contacto" />
                  <input type="hidden" name="next" value={`/inmuebles/${listing.id}`} />
                  <select
                    name="motivo"
                    defaultValue="info"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="info">Quiero información</option>
                    <option value="visita">Quiero visitar</option>
                    <option value="oferta">Quiero hacer oferta</option>
                  </select>
                  <input
                    name="nombre"
                    placeholder="Nombre"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    name="telefono"
                    placeholder="Teléfono"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="submit"
                    className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
                  >
                    Solicitar contacto
                  </button>
                  <p className="text-xs leading-5 text-slate-500">
                    Trazabilidad desde el primer contacto: el equipo sabrá qué inmueble, motivo y preferencia has indicado.
                  </p>
                </form>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold">Área comprador</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Si avanzas con este inmueble, podrás consultar solicitudes, visitas, ofertas y documentación desde tu espacio privado.
                </p>
                <Link
                  href="/compradores"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-semibold hover:bg-[color:var(--surface-2)]"
                >
                  Ver experiencia comprador
                </Link>
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
          priceLabel: listing.priceLabel,
          detailsShort: listing.detailsShort,
        }}
      />
      <ViewTracker listingId={listing.id} />
      <PublicFooter />
    </div>
  );
}

function DecisionSignal({ text }: { text: string }) {
  return (
    <span className="rounded-2xl bg-[color:var(--surface-2)] px-3 py-2">
      {text}
    </span>
  );
}

function HeroTrust({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}

function buildListingJsonLd(listing: Listing) {
  const url = `https://www.verifika2.com/inmuebles/${listing.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    url,
    image: listing.photos?.length ? listing.photos : listing.photo ? [listing.photo] : undefined,
    datePosted: listing.verifiedAt,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: listing.province,
      streetAddress: listing.address,
    },
    offers: {
      "@type": "Offer",
      price: listing.priceValue || undefined,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      businessFunction:
        listing.operation === "alquiler"
          ? "https://schema.org/LeaseOut"
          : "https://schema.org/Sell",
    },
    provider: {
      "@type": "Organization",
      name: "Grupo Modernia",
      logo: "https://www.verifika2.com/brand/grupo_modernia_logo.png",
    },
  };
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
