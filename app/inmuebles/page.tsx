import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/listings";
import { fetchPortalListings } from "@/lib/crmPortal";
import ChatWidget from "@/components/chat/ChatWidget";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";
import ListingCover from "@/components/listings/ListingCover";
import AgencyBadge from "@/components/listings/AgencyBadge";
import HeroIllustration from "@/components/site/HeroIllustration";

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
  const propertyType = normalize(params.tipo).toLowerCase();
  const sort = normalize(params.orden) || "recientes";

  let sourceListings: Listing[] = [];
  try {
    sourceListings = await fetchPortalListings({
      q: normalize(params.q) || undefined,
      operacion: operation || undefined,
      ciudad: normalize(params.ciudad) || undefined,
      certificado: certifiedOnly,
      limit: 120,
    });
  } catch {
    sourceListings = [];
  }
  const filtered = sourceListings.filter((listing) => {
    if (certifiedOnly && !listing.certified) return false;
    if (operation && listing.operation !== operation) return false;
    if (propertyType && listing.propertyType !== propertyType) return false;
    if (city && !listing.city.toLowerCase().includes(city)) return false;
    if (q) {
      const hay = `${listing.title} ${listing.city} ${listing.propertyType} ${listing.operation}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sort === "precio_asc") return a.priceValue - b.priceValue;
    if (sort === "precio_desc") return b.priceValue - a.priceValue;
    return String(b.verifiedAt || "").localeCompare(String(a.verifiedAt || ""));
  });
  const hasFilters = Boolean(q || operation || city || certifiedOnly || propertyType);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="portal" showBack backHref="/" backLabel="Landing" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="relative mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[#101827] p-6 text-white shadow-[0_22px_70px_rgba(11,29,51,0.18)]">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-35 md:block">
            <HeroIllustration className="h-full w-full" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                Portal inmobiliario premium
              </p>
              <h1 className="pt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Inmuebles verificados con dossier y seguimiento.</h1>
              <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
                Inmuebles revisados antes de publicarse, con señales documentales y seguimiento privado para decidir mejor antes de visitar.
              </p>
              <div className="mt-4 grid gap-2 text-xs text-white/72 sm:grid-cols-3">
                <TrustPill text="Titularidad revisable" />
                <TrustPill text="Cargas y registro" />
                <TrustPill text="Lead trazable en CRM" />
              </div>
            </div>
            <div className="relative flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-white/12 px-3 py-1 font-medium text-white ring-1 ring-white/18">Verificados</span>
              <span className="rounded-full bg-[color:var(--brand)] px-3 py-1 font-medium text-[color:var(--brand-foreground)]">
                Documentación revisada
              </span>
              <Link
                href="/verificacion"
                className="font-medium text-white/72 hover:text-white hover:underline"
              >
                ¿Qué significa?
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col justify-between gap-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold">{filtered.length} inmuebles publicados</p>
            <p className="pt-1 text-xs text-slate-500">
              Grupo Modernia publica la cartera. Verifika2 revisa la información y registra cada solicitud con trazabilidad.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <QuickLink href="/inmuebles" active={!hasFilters}>
              Todos
            </QuickLink>
            <QuickLink href="/inmuebles?operacion=venta" active={operation === "venta" && !propertyType}>
              Venta
            </QuickLink>
            <QuickLink href="/inmuebles?operacion=alquiler" active={operation === "alquiler" && !propertyType}>
              Alquiler
            </QuickLink>
            <QuickLink href="/inmuebles?tipo=local" active={propertyType === "local"}>
              Locales
            </QuickLink>
            <QuickLink href="/inmuebles?tipo=piso" active={propertyType === "piso"}>
              Pisos
            </QuickLink>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <form
            method="get"
            className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 md:col-span-1"
          >
            <p className="text-sm font-semibold">Encuentra una oportunidad</p>
            <p className="pt-2 text-xs leading-5 text-slate-500">
              Filtra por operación, zona y nivel de certificación antes de pedir visita.
            </p>
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    className="text-xs font-medium text-slate-600"
                    htmlFor="tipo"
                  >
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    defaultValue={propertyType}
                    className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Todos</option>
                    <option value="piso">Piso</option>
                    <option value="casa">Casa</option>
                    <option value="ático">Ático</option>
                    <option value="local">Local</option>
                  </select>
                </div>
                <div>
                  <label
                    className="text-xs font-medium text-slate-600"
                    htmlFor="orden"
                  >
                    Orden
                  </label>
                  <select
                    id="orden"
                    name="orden"
                    defaultValue={sort}
                    className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="recientes">Recientes</option>
                    <option value="precio_asc">Precio asc.</option>
                    <option value="precio_desc">Precio desc.</option>
                  </select>
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
            <div className="mt-4 rounded-2xl bg-[color:var(--surface-2)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Comprador</p>
              <p className="pt-2 text-xs leading-5 text-slate-600">
                Al solicitar información se crea seguimiento privado para consultar visitas, documentación y estado.
              </p>
              <Link href="/compradores" className="mt-3 inline-flex text-xs font-semibold text-[#0B1D33] hover:underline">
                Ver experiencia comprador
              </Link>
            </div>
          </form>

          <div className="md:col-span-2">
            {sourceListings.length === 0 ? (
              <EmptyState
                title="No hay inmuebles publicados"
                text="Cuando el equipo publique inmuebles desde el CRM aparecerán aquí con su estado de verificación."
                ctaHref="/publicar"
                ctaLabel="Solicitar publicación"
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                text="No hay inmuebles publicados que coincidan con esos filtros. Prueba con otra ciudad, operación o búsqueda."
                ctaHref="/inmuebles"
                ctaLabel="Ver todos"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/inmuebles/${listing.id}`}
                    className="group overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_14px_42px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_54px_rgba(15,23,42,0.10)]"
                  >
                    <ListingCover
                      id={listing.id}
                      label={listing.certified ? "Certificado" : "Verificado"}
                      src={listing.photo}
                      title={listing.title}
                      location={listing.city}
                      propertyType={listing.propertyType}
                    />
                    <div className="p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <AgencyBadge
                          name={listing.agencyName}
                          logo={listing.agencyLogo}
                          compact
                        />
                        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                          Verifika2
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                            {listing.operation === "alquiler" ? "Alquiler" : "Venta"} · {listing.propertyType}
                          </p>
                          <p className="pt-2 text-base font-semibold tracking-tight">
                            {listing.title}
                          </p>
                        </div>
                      </div>
                      <p className="pt-2 text-sm text-slate-600">
                        {[listing.zone, listing.city].filter(Boolean).join(", ") || listing.city}
                      </p>
                      <p className="pt-4 text-3xl font-semibold tracking-tight">
                        {listing.priceLabel}
                      </p>
                      <p className="pt-2 min-h-10 text-sm leading-5 text-slate-600">
                        {listing.detailsShort}
                      </p>
                      <div className="mt-4 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
                        <CardSignal text="Dossier bajo solicitud" />
                        <CardSignal text="Lead trazable en CRM" />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
                        <p className="text-xs text-slate-500">
                          Publica Grupo Modernia
                        </p>
                        <span className="text-sm font-medium text-[color:var(--foreground)] group-hover:underline">
                          Ver ficha
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="mt-8 rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#F2C14E]">No es un portal tradicional.</p>
              <p className="pt-2 max-w-3xl text-sm leading-6 text-white/72">
                Cada anuncio busca reducir incertidumbre: información revisada, lead trazable y áreas privadas para comprador y propietario.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/compradores" className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]">
                Soy comprador
              </Link>
              <Link href="/publicar" className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/16">
                Publicar inmueble
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <ChatWidget scope="portal" defaultPersona="comprador" />
    </div>
  );
}

function TrustPill({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 font-medium">
      {text}
    </span>
  );
}

function CardSignal({ text }: { text: string }) {
  return (
    <span className="rounded-2xl border border-[#ead7a4] bg-[#fff8e5] px-3 py-2 font-semibold text-[#5a4300]">
      {text}
    </span>
  );
}

function EmptyState({
  title,
  text,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  text: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-sm">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      <p className="mx-auto pt-3 max-w-lg text-sm leading-6 text-slate-600">
        {text}
      </p>
      <div className="pt-5">
        <Link
          href={ctaHref}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center justify-center rounded-full px-4 font-medium ${
        active
          ? "bg-[#0B1D33] text-white"
          : "border border-[color:var(--border)] bg-[color:var(--surface)] text-slate-700 hover:bg-[color:var(--surface-2)]"
      }`}
    >
      {children}
    </Link>
  );
}
