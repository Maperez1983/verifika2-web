import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Publicar",
  description:
    "Publica inmuebles en Verifika2 con verificación documental obligatoria. Para particulares e inmobiliarias.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

const links = {
  home: "/",
  portal: "/inmuebles",
  verification: "/verificacion",
  certification: "/certificacion",
  app: "https://app.verifika2.com",
  crmInmo: "https://crm.verifika2.com/?crm=inmo",
};

export default async function PublishPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const sent = normalize(params.sent) === "1";
  const error = normalize(params.error);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader showBack backHref={links.home} backLabel="Landing" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Publicar en Verifika2</h1>
              <p className="pt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Aquí no se publica “cualquier cosa”. Para mantener la esencia del portal,{" "}
                <span className="font-medium">todos los inmuebles</span> deben estar verificados documentalmente.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={links.portal}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Ver inmuebles
              </Link>
              <a
                href={links.app}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Acceso
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold tracking-tight">
              Flujo de publicación (recomendado)
            </p>
            <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">1.</span> Crea el inmueble en el
                CRM (datos mínimos + fotos).
              </li>
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">2.</span> Sube documentación
                necesaria (según tipología/operación).
              </li>
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">3.</span> Verifika2 revisa y
                marca el anuncio como <span className="font-medium">Verificado</span>.
              </li>
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">4.</span> Publicación en el
                portal con evidencias visibles y trazabilidad.
              </li>
            </ol>

            <div className="pt-8 grid gap-4 md:grid-cols-2">
              <Card
                title="Particulares"
                desc="Puedes publicar, pero con verificación obligatoria. Te guiamos en la documentación."
                ctaLabel="Solicitar publicación"
                ctaHref={links.certification}
                variant="secondary"
              />
              <Card
                title="Inmobiliarias"
                desc="Gestiona cartera, pipeline y publicación desde tu workspace. El portal solo muestra lo publicado."
                ctaLabel="Publicar desde el CRM"
                ctaHref={links.crmInmo}
                variant="primary"
              />
            </div>
          </section>

          <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">
              Servicio premium
            </p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              Además de “Verificado”, ofrecemos un servicio premium de{" "}
              <span className="font-medium">certificación de idoneidad</span>{" "}
              emitida por Verifika2 tras analizar la documentación.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href={links.certification}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Ver certificación
              </Link>
              <Link
                href={links.verification}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Qué significa “verificado”
              </Link>
            </div>
            <p className="pt-5 text-xs leading-5 text-slate-600">
              Nota: el alcance exacto del certificado (legal/documental/técnico)
              lo definimos en la fase de producto.
            </p>
          </aside>
        </div>

        <div className="pt-10">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">
              Solicitar publicación (particular / propietario)
            </p>
            <p className="pt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Deja tus datos y te contactamos para iniciar la verificación documental del anuncio.
            </p>

            {sent ? (
              <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
                <p className="font-semibold">Solicitud enviada</p>
                <p className="pt-2 leading-6">
                  Hemos registrado tu solicitud. Te pediremos la documentación necesaria para verificar el anuncio.
                </p>
              </div>
            ) : null}

            {error && !sent ? (
              <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                <p className="font-semibold">No se pudo enviar</p>
                <p className="pt-2 leading-6">Error: {error}</p>
              </div>
            ) : null}

            <form method="post" action="/api/publicar" className="pt-6 grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
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
              </div>
              <input
                name="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  name="ciudad"
                  placeholder="Ciudad"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <select
                  name="operacion"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                  defaultValue=""
                >
                  <option value="">Operación (opcional)</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              <textarea
                name="mensaje"
                placeholder="Mensaje (tipo de inmueble, zona, etc.)"
                className="min-h-[112px] w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
              <p className="text-xs text-slate-600">
                Necesitamos al menos <span className="font-medium">teléfono o email</span>.
              </p>
              <label className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="consent" value="1" className="mt-1" />
                <span>
                  Acepto que se registren mis datos para gestionar esta solicitud y contactarme sobre la publicación.
                </span>
              </label>
              <button
                type="submit"
                className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Enviar solicitud
              </button>
            </form>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Card({
  title,
  desc,
  ctaLabel,
  ctaHref,
  variant,
}: {
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
  variant: "primary" | "secondary";
}) {
  const isInternal = ctaHref.startsWith("/");
  const base =
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium";
  const cls =
    variant === "primary"
      ? `${base} bg-[#0B1D33] text-white hover:bg-[#0F2742]`
      : `${base} border border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-2)]`;

  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <div className="pt-5">
        {isInternal ? (
          <Link href={ctaHref} className={cls}>
            {ctaLabel}
          </Link>
        ) : (
          <a href={ctaHref} className={cls}>
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}
