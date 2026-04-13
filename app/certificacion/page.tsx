import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Certificación",
  description:
    "Servicio premium de Verifika2: certificación de idoneidad tras análisis documental para elevar la seguridad jurídica de la operación.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  verification: "/verificacion",
  publish: "/publicar",
  app: "https://app.verifika2.com",
};

export default function CertificationPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="certification" showBack backHref={links.home} backLabel="Landing" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Certificación de idoneidad (premium)</h1>
              <p className="pt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Un nivel superior a “verificado”: Verifika2 emite la certificación tras analizar documentación, alcance y consistencia.
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
              Qué aporta al comprador (y al propietario)
            </p>
            <div className="pt-5 grid gap-3 md:grid-cols-3">
              <Card
                title="Más confianza"
                desc="Reduce incertidumbre y acelera decisiones con un marco objetivo."
              />
              <Card
                title="Menos fricción"
                desc="Documentación ordenada y revisada: menos idas y venidas."
              />
              <Card
                title="Trazabilidad"
                desc="Fecha, alcance y límites claros de la certificación."
              />
            </div>

            <div className="pt-8">
              <p className="text-sm font-semibold tracking-tight">
                Proceso (borrador de producto)
              </p>
              <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">1.</span> Recolección de
                  documentación (según tipo de inmueble y operación).
                </li>
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">2.</span> Revisión documental
                  y consistencia del anuncio.
                </li>
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">3.</span> Emisión del
                  certificado (con alcance y limitaciones).
                </li>
                <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  <span className="font-semibold">4.</span> Publicación en la
                  ficha del inmueble como “Certificado”.
                </li>
              </ol>
              <p className="pt-4 text-xs leading-5 text-slate-600">
                Importante: definiremos el alcance exacto (legal/documental/técnico)
                y los disclaimers para evitar interpretaciones erróneas.
              </p>
            </div>

            <div className="pt-8">
              <p className="text-sm font-semibold tracking-tight">Comparativa</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <BadgeCard
                  title="Verificado"
                  subtitle="Incluido en el portal"
                  bullets={[
                    "Evidencias visibles",
                    "Estado documental claro",
                    "Trazabilidad",
                  ]}
                />
                <BadgeCard
                  title="Certificado"
                  subtitle="Servicio premium Verifika2"
                  bullets={[
                    "Análisis ampliado",
                    "Informe/alcance definido",
                    "Señal “premium” en ficha",
                  ]}
                  highlight
                />
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">
              Próximo paso
            </p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              Podemos habilitar la certificación como opción por inmueble desde
              el CRM, y mostrarla en el portal.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href={links.verification}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Leer verificación
              </Link>
              <a
                href={links.app}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
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

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function BadgeCard({
  title,
  subtitle,
  bullets,
  highlight,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[28px] border p-6 ${
        highlight
          ? "border-[color:var(--brand)] bg-[color:var(--surface)]"
          : "border-[color:var(--border)] bg-[color:var(--surface)]"
      }`}
    >
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-1 text-xs text-slate-600">{subtitle}</p>
      <ul className="pt-4 space-y-2 text-sm text-slate-700">
        {bullets.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
