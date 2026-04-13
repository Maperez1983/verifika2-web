import type { Metadata } from "next";
import Link from "next/link";
import { mockListingsById } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Solicitar información o visita",
  description:
    "Solicita información o visita sobre un inmueble verificado. La solicitud se registra con trazabilidad.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();
const sanitizeNextPath = (value: unknown, fallback: string) => {
  const next = normalize(value);
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.includes("\\")) return fallback;
  return next;
};

export default async function InterestPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const listingId = normalize(params.listing);
  const tipo = normalize(params.tipo) || "info";
  const sent = normalize(params.sent) === "1";
  const error = normalize(params.error);
  const detail = normalize(params.detail);
  const next = sanitizeNextPath(params.next, "/inmuebles");
  const listing = listingId ? mockListingsById[listingId] : undefined;

  const title =
    tipo === "visita"
      ? "Pedir visita"
      : tipo === "contacto"
        ? "Contactar"
        : "Solicitar información";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Portal verificado
          </p>
          <h1 className="pt-3 text-3xl font-semibold tracking-tight">
            {sent ? "Solicitud enviada" : title}
          </h1>
          {sent ? (
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
          ) : (
            <p className="pt-3 text-sm leading-6 text-slate-600">
              {listing ? (
                <>
                  Estás solicitando <span className="font-medium">{tipo}</span>{" "}
                  para <span className="font-medium">{listing.title}</span> en{" "}
                  <span className="font-medium">{listing.city}</span>.
                </>
              ) : (
                <>Completa el formulario para registrar tu solicitud.</>
              )}{" "}
              Te responderemos lo antes posible.
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          {sent ? (
            <>
              <p className="text-sm font-semibold tracking-tight">
                Qué pasa ahora
              </p>
              <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">1.</span> La inmobiliaria (o
                  el anunciante) recibe el interés.
                </li>
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">2.</span> Verifika2 lo registra
                  con trazabilidad (fecha, canal y estado).
                </li>
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">3.</span> Puedes seguir
                  consultando la ficha del inmueble.
                </li>
              </ol>

              <div className="pt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={next || "/inmuebles"}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Volver
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
            </>
          ) : (
            <>
              <p className="text-sm font-semibold tracking-tight">Formulario</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                {tipo === "visita"
                  ? "Indica tus datos y, si quieres, tu disponibilidad."
                  : "Indica tus datos para poder responderte."}
              </p>

              {error ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                  <p className="font-semibold">No se ha podido enviar.</p>
                  <p className="pt-2 leading-6">
                    {error === "missing_contact"
                      ? "Falta un email o teléfono."
                      : error === "missing_consent"
                        ? "Debes aceptar el consentimiento."
                        : "Error al registrar la solicitud. Inténtalo de nuevo."}
                  </p>
                  {detail ? (
                    <p className="pt-2 text-xs text-amber-900/80">{detail}</p>
                  ) : null}
                </div>
              ) : null}

              <form method="post" action="/api/interes" className="pt-6 grid gap-3">
                <input type="hidden" name="listing" value={listingId} />
                <input type="hidden" name="tipo" value={tipo} />
                <input type="hidden" name="next" value={next} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    name="nombre"
                    defaultValue={normalize(params.nombre)}
                    placeholder="Nombre"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    name="telefono"
                    defaultValue={normalize(params.telefono)}
                    placeholder="Teléfono (opcional)"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <input
                  name="email"
                  defaultValue={normalize(params.email)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  required
                />
                <textarea
                  name="mensaje"
                  defaultValue={normalize(params.mensaje)}
                  placeholder={tipo === "visita" ? "Disponibilidad / mensaje" : "Mensaje (opcional)"}
                  className="min-h-[112px] w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

                <label className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm text-slate-700">
                  <input type="checkbox" name="consent" value="1" className="mt-1" />
                  <span>
                    Acepto que se registren mis datos para gestionar esta solicitud y
                    contactarme sobre este inmueble.
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Enviar
                </button>

                <div className="pt-2 text-xs text-slate-600">
                  Consejo: si prefieres, puedes volver a la ficha y pedir visita o
                  información desde allí.
                </div>
              </form>

              <div className="pt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/inmuebles"
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
