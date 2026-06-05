import type { Metadata } from "next";
import Link from "next/link";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

export const metadata: Metadata = {
  title: "Seguridad jurídica inmobiliaria",
  description:
    "Seguridad jurídica para comprar, vender o publicar inmuebles: titularidad, situación registral, cargas, documentación y trazabilidad comercial.",
};

const checks = [
  ["Titularidad", "Quién figura como titular y qué documentación lo respalda."],
  ["Situación registral", "Información registral disponible antes de avanzar."],
  ["Cargas", "Señales sobre cargas, limitaciones o aspectos a revisar."],
  ["Documentación comercial", "Datos del anuncio contrastados con la información disponible."],
  ["Trazabilidad", "Registro de solicitudes, visitas, ofertas y próximos pasos."],
];

const useCases = [
  {
    title: "Comprador",
    desc: "Puede pedir documentación antes de visitar o reservar, y seguir el estado desde su área privada.",
    href: "/compradores",
  },
  {
    title: "Propietario",
    desc: "Ve cómo se gestiona su inmueble: clientes, citas, anuncio, documentos e hitos de venta.",
    href: "/propietarios",
  },
  {
    title: "Inmobiliaria",
    desc: "Publica desde CRM con documentación vinculada, leads accionables y seguimiento de cada operación.",
    href: "/profesionales",
  },
];

export default function LegalSecurityPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader showBack backHref="/" backLabel="Landing" />

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Seguridad jurídica inmobiliaria
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Menos incertidumbre documental antes de comprar, vender o publicar.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                Verifika2 convierte la revisión documental y la trazabilidad comercial en parte visible de la experiencia:
                titularidad, situación registral, cargas, documentación y seguimiento desde CRM.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/inmuebles" className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]">
                  Ver inmuebles
                </Link>
                <Link href="/publicar" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16">
                  Publicar con verificación
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <p className="text-sm font-semibold">Dossier documental</p>
                <div className="mt-4 grid gap-3">
                  {checks.slice(0, 4).map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold tracking-tight">{title}</p>
                      <p className="pt-1 text-xs leading-5 text-slate-600">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-4 md:grid-cols-5">
              {checks.map(([title, desc]) => (
                <div key={title} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
                  <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
                  <p className="text-sm font-semibold tracking-tight">{title}</p>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface-2)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Casos de uso
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                La seguridad cambia según quién entra en la operación.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Comprador, propietario e inmobiliaria necesitan información distinta, pero todos se benefician de la misma base:
                documentación ordenada y actividad trazable.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {useCases.map((item) => (
                <Link key={item.title} href={item.href} className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                  <p className="text-base font-semibold tracking-tight">{item.title}</p>
                  <p className="mt-3 min-h-[96px] text-sm leading-6 text-slate-600">{item.desc}</p>
                  <p className="mt-5 text-sm font-semibold group-hover:underline">Ver recorrido</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
