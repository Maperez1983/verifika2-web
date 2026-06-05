import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListing } from "@/lib/crmPortal";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

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
  const motivo = normalize(params.motivo) || tipo;
  const sent = normalize(params.sent) === "1";
  const error = normalize(params.error);
  const detail = normalize(params.detail);
  const buyerCode = normalize(params.buyer_code);
  const next = sanitizeNextPath(params.next, "/inmuebles");
  const listing = listingId
    ? await fetchPortalListing(listingId).catch(() => null)
    : undefined;

  const title =
    tipo === "visita"
      ? "Pedir visita"
      : tipo === "contacto"
        ? "Contactar"
        : motivo === "documentacion"
          ? "Pedir documentación"
          : motivo === "oferta"
            ? "Hacer oferta"
            : motivo === "duda"
              ? "Resolver una duda"
        : "Solicitar información";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader showBack backHref={listing ? `/inmuebles/${listing.id}` : "/inmuebles"} backLabel={listing ? "Ficha" : "Inmuebles"} />

      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Portal verificado
            </p>
            <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              {sent ? "Solicitud registrada con trazabilidad" : title}
            </h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              {sent
                ? "La solicitud queda conectada al inmueble, al contacto y al flujo comercial para que no se pierda el contexto."
                : "Completa tus datos y el equipo recibirá la solicitud con el contexto del inmueble, motivo y preferencia de contacto."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <HeaderStep index="01" title="Solicitud" />
            <HeaderStep index="02" title="CRM" />
            <HeaderStep index="03" title="Seguimiento" />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-7">
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

              {buyerCode ? (
                <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-950">
                  <p className="font-semibold">Área comprador creada</p>
                  <p className="pt-2 leading-6">
                    Código: <span className="font-semibold">{buyerCode}</span>. Entra con tu teléfono/email y este código para seguir solicitudes, visitas y ofertas.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/comprador"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-semibold text-white hover:bg-[#0F2742]"
                    >
                      Ir a mi área
                    </Link>
                  </div>
                </div>
              ) : null}

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
              <p className="text-sm font-semibold tracking-tight">Datos de contacto</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                {tipo === "visita"
                  ? "Indica tus datos y, si quieres, tu disponibilidad."
                  : "Indica tus datos para poder responderte con contexto y trazabilidad."}
              </p>

              {error ? (
                <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                  <p className="font-semibold">No se ha podido enviar.</p>
                  <p className="pt-2 leading-6">
                    {error === "missing_contact"
                      ? "Falta un email o teléfono."
                      : error === "missing_phone"
                        ? "Para pedir visita necesitamos un teléfono."
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
                <div className="grid gap-2 sm:grid-cols-3">
                  <select
                    name="motivo"
                    defaultValue={motivo}
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="info">Información</option>
                    <option value="documentacion">Documentación</option>
                    <option value="visita">Visita</option>
                    <option value="oferta">Oferta</option>
                    <option value="duda">Tengo una duda</option>
                  </select>
                  <select
                    name="urgencia"
                    defaultValue={normalize(params.urgencia)}
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Prioridad</option>
                    <option value="hoy">Hoy</option>
                    <option value="48h">Próximas 48h</option>
                    <option value="semana">Esta semana</option>
                  </select>
                  <input
                    name="horario"
                    defaultValue={normalize(params.horario)}
                    placeholder="Horario"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
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
                    placeholder="Teléfono"
                    className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <input
                  name="email"
                  defaultValue={normalize(params.email)}
                  placeholder="Email opcional"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <textarea
                  name="mensaje"
                  defaultValue={normalize(params.mensaje)}
                  placeholder={tipo === "visita" ? "Disponibilidad / mensaje" : "Mensaje (opcional)"}
                  className="min-h-[112px] w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <p className="text-xs text-slate-600">
                  Para visitas recomendamos dejar <span className="font-medium">teléfono</span>. Para información basta teléfono o email.
                </p>

                <label className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm text-slate-700">
                  <input type="checkbox" name="consent" value="1" className="mt-1" />
                  <span>
                    Acepto que se registren mis datos para gestionar esta solicitud y
                    contactarme sobre este inmueble.
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
                >
                  Registrar solicitud
                </button>

                <div className="pt-2 text-xs text-slate-600">
                  La solicitud se registra vinculada al inmueble y puede crear tu área comprador.
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
        </section>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 grid gap-4">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Resumen de la solicitud</p>
              {listing ? (
                <div className="mt-4 rounded-2xl bg-[color:var(--surface-2)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Inmueble
                  </p>
                  <p className="pt-2 text-base font-semibold tracking-tight">{listing.title}</p>
                  <p className="pt-1 text-sm text-slate-600">{listing.city} · {listing.priceLabel}</p>
                </div>
              ) : null}
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <SummaryRow label="Motivo" value={motivoLabel(motivo || tipo)} />
                <SummaryRow label="Registro" value="Lead trazable" />
                <SummaryRow label="Respuesta" value="Equipo comercial" />
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Qué ocurre después</p>
              <div className="pt-4 grid gap-3">
                <ProcessStep index="01" title="Se registra el interés" desc="Queda vinculado al inmueble y al motivo indicado." />
                <ProcessStep index="02" title="El equipo responde" desc="La inmobiliaria recibe contexto para priorizar la respuesta." />
                <ProcessStep index="03" title="Puedes hacer seguimiento" desc="Si se genera código, podrás entrar en tu área comprador." />
              </div>
            </div>
          </div>
        </aside>
      </main>
      <PublicFooter />
    </div>
  );
}

function motivoLabel(value: string) {
  if (value === "visita") return "Visita";
  if (value === "documentacion") return "Documentación";
  if (value === "oferta") return "Oferta";
  if (value === "duda") return "Duda";
  if (value === "contacto") return "Contacto";
  return "Información";
}

function HeaderStep({ index, title }: { index: string; title: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
      <p className="text-xs font-semibold text-[#F2C14E]">{index}</p>
      <p className="pt-1 text-sm font-semibold">{title}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function ProcessStep({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
      <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
      <p className="pt-1 text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-1 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}
