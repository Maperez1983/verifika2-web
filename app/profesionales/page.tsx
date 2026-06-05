import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Acceso profesionales",
  description:
    "Acceso profesional a Verifika2. La parte interna (CRM modular) que hace posible el portal, la verificación y el seguimiento de operaciones.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  owners: "/propietarios",
  app: "https://app.verifika2.com",
  appInmo: "https://app.verifika2.com/?crm=inmo",
  crm: "https://crm.verifika2.com",
};

export default function ProfessionalsPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="pros" showBack backHref={links.home} backLabel="Landing" />

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Para inmobiliarias
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Publica inmuebles verificados y opera cada lead desde CRM.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                Verifika2 une portal, CRM inmobiliario, documentación, agenda, comprador y propietario en una experiencia
                comercial preparada para generar confianza desde el primer contacto.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={links.appInmo}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
              >
                Alta profesional
              </a>
              <Link
                href={links.portal}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16"
              >
                Ver portal
              </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <p className="text-sm font-semibold">Workspace inmobiliario</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <HeroTile label="Leads" value="CRM" />
                  <HeroTile label="Agenda" value="Citas" />
                  <HeroTile label="Documentos" value="Validación" />
                  <HeroTile label="Propietario" value="Reporte" />
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Flujo premium</p>
                  <p className="pt-2 text-sm leading-6 text-slate-700">
                    Captación → verificación → publicación → lead comprador → seguimiento propietario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold tracking-tight">
              Cómo se accede al CRM
            </p>
            <ol className="pt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">1.</span> Entra desde{" "}
                <span className="font-medium">Acceso</span> y autentícate.
              </li>
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">2.</span> Elige el{" "}
                <span className="font-medium">workspace</span> (tu empresa o
                cliente).
              </li>
              <li className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                <span className="font-semibold">3.</span> Solo verás los{" "}
                <span className="font-medium">módulos activos</span> para ese
                workspace (inmobiliaria, asesoría, etc.).
              </li>
            </ol>

            <div className="pt-6 grid gap-3 sm:grid-cols-2">
              <Card
                title="Permisos por workspace"
                desc="Cada cliente opera con sus datos. Un admin local no ve otros workspaces."
              />
              <Card
                title="Publicación controlada"
                desc="Los anuncios pasan por estados. El portal solo muestra lo publicado."
              />
              <Card
                title="Documentación y trazabilidad"
                desc="Evidencias vinculadas a cada operación o anuncio, con registro."
              />
              <Card
                title="Automatizaciones"
                desc="Flujos para reducir tareas repetitivas y asegurar consistencia."
              />
            </div>
          </div>

          <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">
              Links rápidos
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <a
                href={links.appInmo}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Publicar (Inmobiliaria)
              </a>
              <a
                href={links.crm}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Abrir CRM
              </a>
              <Link
                href={links.owners}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Portal propietario
              </Link>
              <Link
                href={links.portal}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Portal inmuebles
              </Link>
            </div>
            <p className="pt-5 text-xs leading-5 text-slate-600">
              Consejo: para el público, usa el portal. Para operativa y
              publicación, usa el acceso profesional.
            </p>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function HeroTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="pt-1 text-lg font-semibold tracking-tight">{value}</p>
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
