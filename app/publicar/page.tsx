import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicar",
  description:
    "Publica inmuebles en Verifika2 con verificación documental obligatoria. Para particulares e inmobiliarias.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  verification: "/verificacion",
  certification: "/certificacion",
  app: "https://app.verifika2.com",
  crmInmo: "https://crm.verifika2.com/?crm=inmo",
};

export default function PublishPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <Link
              href={links.home}
              className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
            >
              ← Volver
            </Link>
            <h1 className="pt-2 text-2xl font-semibold tracking-tight">
              Publicar en Verifika2
            </h1>
            <p className="pt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Aquí no se publica “cualquier cosa”. Para mantener la esencia del
              portal, <span className="font-medium">todos los inmuebles</span>{" "}
              deben estar verificados documentalmente.
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
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
      </main>
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

