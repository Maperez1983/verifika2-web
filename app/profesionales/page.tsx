import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Profesionales",
  description:
    "Solución profesional de Verifika2: CRM modular, portal, verificación y seguimiento de operaciones inmobiliarias.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  owners: "/propietarios",
  publish: "/publicar",
};

const professionalBundles = [
  {
    title: "Captación y cartera",
    desc: "Alta de inmuebles, propietarios, documentación, estado comercial y publicación controlada.",
  },
  {
    title: "Leads y compradores",
    desc: "Cada contacto del portal entra como comprador vinculado al inmueble, con intención y contexto.",
  },
  {
    title: "Agenda y operación",
    desc: "Citas, visitas, ofertas, seguimiento y próximos pasos visibles para el equipo y el propietario.",
  },
  {
    title: "Portal propietario gestionado",
    desc: "La agencia habilita el portal del propietario cuando gestiona el inmueble y decide qué información compartir.",
  },
  {
    title: "Imagen premium",
    desc: "Anuncios verificados, sello Grupo Modernia, dossier visual y experiencia diferenciada del portal tradicional.",
  },
];

const onboardingSteps = [
  ["01", "Workspace", "Creamos el espacio de la inmobiliaria con permisos y módulos activos."],
  ["02", "Cartera inicial", "Cargamos inmuebles reales, fotos, propietarios y documentación disponible."],
  ["03", "Publicación", "Se activan anuncios verificados y se conecta la captación de leads."],
  ["04", "Piloto comercial", "La agencia prueba leads, citas, propietarios y seguimiento con casos reales."],
];

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
              <Link
                href={links.publish}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
              >
                Solicitar publicación
              </Link>
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
              Operativa profesional
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href={links.publish}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Solicitar publicación
              </Link>
              <Link
                href={links.portal}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Portal inmuebles
              </Link>
            </div>
            <p className="pt-5 text-xs leading-5 text-slate-600">
              Gestión documental, publicación, leads, citas y propietarios conectados en una operativa profesional.
            </p>
          </aside>
        </div>

        <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Plan profesional
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Lo que necesita una inmobiliaria para usarlo como producto comercial.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {professionalBundles.map((item) => (
                <BundleCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Implantación comercial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Piloto preparado para vender sin prometer una migración compleja.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                La entrada comercial debe ser sencilla: cargar una cartera limitada, publicar con verificación y medir respuesta real de compradores y propietarios.
              </p>
            </div>
            <div className="grid gap-3">
              {onboardingSteps.map(([index, title, desc]) => (
                <OnboardingRow key={index} index={index} title={title} desc={desc} />
              ))}
            </div>
          </div>
        </section>
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

function BundleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function OnboardingRow({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm sm:grid-cols-[64px_1fr]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1D33] text-sm font-semibold text-white">
        {index}
      </span>
      <div>
        <p className="text-base font-semibold tracking-tight">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
      </div>
    </div>
  );
}
