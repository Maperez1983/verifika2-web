import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListing } from "@/lib/crmPortal";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

export const metadata: Metadata = {
  title: "Dossier Verifika2",
  description:
    "Revisión documental del inmueble antes de reservar, ofertar o firmar: alcance, precios y solicitud de informe Verifika2.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function DossierPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const listingId = normalize(params.listing);
  const returnTo = normalize(params.next) || (listingId ? `/inmuebles/${listingId}` : "/inmuebles");
  const listing = listingId ? await fetchPortalListing(listingId).catch(() => null) : null;
  const baseHref = `/interes?tipo=info${listingId ? `&listing=${encodeURIComponent(listingId)}` : ""}&next=${encodeURIComponent(returnTo)}`;

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="verification" showBack backHref={returnTo} backLabel="Volver" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] p-8 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Dossier Verifika2
          </p>
          <h1 className="pt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Revisa la documentación antes de reservar, ofertar o firmar
          </h1>
          <p className="pt-4 max-w-3xl text-sm leading-6 text-white/72">
            Un informe documental para compradores que quieren tomar decisiones con más seguridad: titularidad,
            situación registral, cargas, referencias y documentación disponible.
          </p>
          {listing ? (
            <div className="mt-6 rounded-3xl border border-white/12 bg-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Inmueble seleccionado
              </p>
              <p className="pt-2 text-lg font-semibold tracking-tight">{listing.title}</p>
              <p className="pt-1 text-sm text-white/70">{listing.city} · {listing.priceLabel}</p>
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Qué incluye</p>
              <div className="pt-5 grid gap-3 md:grid-cols-2">
                <Feature title="Titularidad y nota simple" desc="Comprobación documental de titularidad y situación registral disponible." />
                <Feature title="Cargas y limitaciones" desc="Revisión de cargas, afecciones o notas relevantes cuando consten." />
                <Feature title="Catastro y datos básicos" desc="Contraste de referencias, superficie, ubicación y datos comerciales disponibles." />
                <Feature title="Resumen claro" desc="Informe con alcance, puntos revisados, incidencias y siguiente recomendación." />
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Precios orientativos</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Antes de iniciar el informe, el equipo confirma alcance, plazo y precio definitivo según el inmueble.
              </p>
              <div className="pt-5 grid gap-4 md:grid-cols-3">
                <Plan
                  title="Verificación básica"
                  price="Desde 49 €"
                  desc="Titularidad, nota simple, cargas y referencia catastral."
                  href={`${baseHref}&motivo=dossier_basico`}
                  cta="Solicitar básica"
                  highlight
                />
                <Plan
                  title="Dossier completo"
                  price="Desde 149 €"
                  desc="Checklist ampliada, incidencias, documentos disponibles y resumen."
                  href={`${baseHref}&motivo=dossier_completo`}
                  cta="Solicitar dossier"
                />
                <Plan
                  title="Nota simple actualizada"
                  price="Bajo presupuesto"
                  desc="Solicitud puntual para confirmar situación registral reciente."
                  href={`${baseHref}&motivo=nota_simple`}
                  cta="Solicitar nota"
                />
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">Cómo funciona</p>
                <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">1. Solicitas el informe.</li>
                  <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">2. Confirmamos alcance y precio.</li>
                  <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">3. Se revisa la documentación.</li>
                  <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">4. Recibes el resumen documental.</li>
                </ol>
              </div>
              <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
                <p className="text-sm font-semibold tracking-tight">Nota importante</p>
                <p className="pt-2 text-sm leading-6">
                  El Dossier Verifika2 es una revisión documental con alcance definido. No sustituye una due diligence legal,
                  técnica o fiscal personalizada cuando la operación lo requiera.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function Plan({
  title,
  price,
  desc,
  href,
  cta,
  highlight,
}: {
  title: string;
  price: string;
  desc: string;
  href: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-[28px] border p-5 ${highlight ? "border-[#0B1D33] bg-[#0B1D33] text-white" : "border-[color:var(--border)] bg-[color:var(--surface-2)]"}`}>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-3 text-2xl font-semibold tracking-tight">{price}</p>
      <p className={`pt-3 text-sm leading-6 ${highlight ? "text-white/72" : "text-slate-600"}`}>{desc}</p>
      <Link
        href={href}
        className={`mt-5 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold ${highlight ? "bg-[#F2C14E] text-[#0B1D33] hover:bg-[#ffd56f]" : "bg-[#0B1D33] text-white hover:bg-[#0F2742]"}`}
      >
        {cta}
      </Link>
    </div>
  );
}
