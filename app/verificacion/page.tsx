import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Verificación",
  description:
    "Qué significa “verificado” en Verifika2: evidencias visibles, estado documental y trazabilidad para reducir fraude e inseguridad jurídica.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  publish: "/publicar",
  certification: "/certificacion",
  app: "https://app.verifika2.com",
};

export default function VerificationPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="verification" showBack backHref={links.home} backLabel="Landing" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Qué significa “Verificado”</h1>
              <p className="pt-2 max-w-3xl text-sm leading-6 text-slate-600">
                En Verifika2, “verificado” no es un claim: es un estado con evidencias y trazabilidad.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={links.portal}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Ver portal
              </Link>
              <Link
                href={links.publish}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Publicar
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold tracking-tight">
              El problema a resolver
            </p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              En portales tradicionales, el usuario ve un anuncio y no sabe si es
              real, si hay intermediación legítima o en qué situación documental
              está. Eso genera incertidumbre y riesgo de fraude.
            </p>

            <div className="pt-6 grid gap-3 md:grid-cols-3">
              <Pill title="Evidencias" desc="Qué respalda el anuncio." />
              <Pill title="Estado" desc="Qué está ok y qué falta." />
              <Pill title="Trazabilidad" desc="Cuándo se revisó." />
            </div>

            <div className="pt-8">
              <p className="text-sm font-semibold tracking-tight">
                Cómo se muestra en la ficha
              </p>
              <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Sello Verifika2</p>
                    <p className="pt-1 text-sm text-slate-600">
                      Ejemplo de evidencias visibles para el usuario.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    Verificado
                  </span>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-700">
                  <Row label="Titularidad / nota simple" status="OK" tone="ok" />
                  <Row label="Certificado energético" status="OK" tone="ok" />
                  <Row label="Datos básicos del anuncio" status="OK" tone="ok" />
                  <Row label="Urbanismo (si aplica)" status="En revisión" tone="warn" />
                </div>
                <p className="pt-4 text-xs leading-5 text-slate-600">
                  Nota: el set exacto de evidencias depende del tipo de inmueble
                  y de la operación.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Nivel premium</p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              Para operaciones donde se requiere un nivel extra de seguridad,
              existe el servicio de <span className="font-medium">certificación</span>{" "}
              emitida por Verifika2.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href={links.certification}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Ver certificación
              </Link>
              <a
                href={links.app}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Acceso
              </a>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function Pill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function Row({
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
