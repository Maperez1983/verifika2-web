import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Portal inmobiliario",
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
  buyers: "/compradores",
  owners: "/propietarios",
  pros: "/profesionales",
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

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Portal inmobiliario verificado
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Publicar no es subir un anuncio. Es presentar un inmueble con confianza.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                En Verifika2 cada inmueble debe pasar por una revisión documental y comercial antes de mostrarse.
                El resultado es un portal más serio para compradores, propietarios e inmobiliarias.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={links.portal}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
              >
                Ver inmuebles
              </Link>
              <a
                href={links.crmInmo}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16"
              >
                Publicar desde CRM
              </a>
              </div>
              <p className="pt-3 text-xs leading-5 text-white/56">
                Sin publicar inmuebles sin revisar. Trazabilidad desde el primer contacto.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <p className="text-sm font-semibold">Flujo de publicación premium</p>
                <div className="mt-4 grid gap-3">
                  <ProofStep index="01" title="Captación en CRM" desc="Datos, fotos, propietario y operación." />
                  <ProofStep index="02" title="Revisión documental" desc="Titularidad, cargas y situación registral cuando proceda." />
                  <ProofStep index="03" title="Publicación trazable" desc="Lead comprador, citas y reportes conectados." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
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

        <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <div className="grid gap-4 md:grid-cols-3">
              <ProfileCta title="Soy inmobiliaria" desc="Quiero publicar cartera verificada y gestionar leads desde CRM." href={links.pros} cta="Ver solución profesional" />
              <ProfileCta title="Soy propietario" desc="Quiero saber cómo se gestionará mi inmueble y qué podré ver." href={links.owners} cta="Ver portal propietario" />
              <ProfileCta title="Soy comprador" desc="Quiero entender qué aporta comprar con información verificada." href={links.buyers} cta="Ver experiencia comprador" />
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6 py-12">
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
                className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
              >
                Enviar solicitud
              </button>
              <p className="text-xs leading-5 text-slate-500">
                Te contactaremos para revisar documentación, alcance de verificación y forma de publicación.
              </p>
            </form>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function ProofStep({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
      <p className="pt-1 text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-1 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}

function ProfileCta({ title, desc, href, cta }: { title: string; desc: string; href: string; cta: string }) {
  return (
    <Link href={href} className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{desc}</p>
      <p className="mt-5 text-sm font-semibold text-[#0B1D33] group-hover:underline">{cta}</p>
    </Link>
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
