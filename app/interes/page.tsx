import type { Metadata } from "next";
import Link from "next/link";
import { mockListingsById } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Solicitud enviada",
  description:
    "Confirmación de solicitud de información o visita. En producción se registrará en el CRM con trazabilidad.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function InterestPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const listingId = normalize(params.listing);
  const tipo = normalize(params.tipo) || "contacto";
  const listing = listingId ? mockListingsById[listingId] : undefined;

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Confirmación
          </p>
          <h1 className="pt-3 text-3xl font-semibold tracking-tight">
            Solicitud enviada
          </h1>
          <p className="pt-3 text-sm leading-6 text-slate-600">
            {listing ? (
              <>
                Hemos registrado tu solicitud para{" "}
                <span className="font-medium">{listing.title}</span> en{" "}
                <span className="font-medium">{listing.city}</span>.
              </>
            ) : (
              <>Hemos registrado tu solicitud.</>
            )}{" "}
            Tipo: <span className="font-medium">{tipo}</span>.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Qué pasa ahora</p>
          <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
              <span className="font-semibold">1.</span> La inmobiliaria (o el
              anunciante) recibe el interés.
            </li>
            <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
              <span className="font-semibold">2.</span> En producción, Verifika2
              lo registra en el CRM con trazabilidad (fecha, canal y estado).
            </li>
            <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
              <span className="font-semibold">3.</span> Puedes pedir visita o
              más documentación desde la ficha del inmueble.
            </li>
          </ol>

          <div className="pt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/inmuebles"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Volver al portal
            </Link>
            {listing ? (
              <Link
                href={`/inmuebles/${listing.id}`}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Volver a la ficha
              </Link>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

