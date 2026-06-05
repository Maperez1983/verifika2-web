import type { Metadata } from "next";
import Link from "next/link";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Cómo funciona Verifika2: CRM inmobiliario, verificación documental, publicación, leads, área comprador y portal propietario.",
};

const flow = [
  ["01", "CRM", "La inmobiliaria crea el inmueble, propietario, documentación, agenda y estado comercial."],
  ["02", "Verificación", "La información se revisa antes de publicarse y se muestran señales de confianza."],
  ["03", "Portal", "El comprador ve inmuebles verificados y solicita visita, documentación u oferta."],
  ["04", "Lead", "Cada solicitud entra con contexto y queda vinculada al inmueble y al comprador."],
  ["05", "Área comprador", "El comprador puede seguir solicitudes, visitas, ofertas y documentación."],
  ["06", "Portal propietario", "El propietario ve clientes, citas, anuncio, documentación e hitos de gestión."],
];

const faqs = [
  {
    group: "Compradores",
    items: [
      ["¿Qué significa verificado?", "Que la información del anuncio se ha revisado antes de publicarse y queda trazabilidad de la solicitud."],
      ["¿Puedo pedir documentación?", "Sí. Desde cada ficha puedes solicitar documentación, visita, oferta o resolver dudas."],
    ],
  },
  {
    group: "Propietarios",
    items: [
      ["¿Qué veo en mi portal?", "Actividad del anuncio, clientes interesados, citas, documentación, ofertas e hitos de gestión."],
      ["¿Quién me da acceso?", "La inmobiliaria o Verifika2 genera un código privado vinculado a tus inmuebles."],
    ],
  },
  {
    group: "Inmobiliarias",
    items: [
      ["¿Dónde se publica?", "Desde el CRM inmobiliario, con control de estados y trazabilidad de cada inmueble."],
      ["¿Los leads llegan al CRM?", "El flujo está pensado para convertir cada contacto en comprador vinculado al inmueble."],
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader showBack backHref="/" backLabel="Landing" />

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Cómo funciona
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Del CRM a la venta: una operación inmobiliaria trazable.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                Verifika2 conecta la publicación del inmueble con la verificación documental, la captación de leads y las áreas privadas de comprador y propietario.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/inmuebles" className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]">
                  Ver inmuebles
                </Link>
                <Link href="/publicar" className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16">
                  Publicar inmueble
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <p className="text-sm font-semibold">Flujo conectado</p>
                <div className="mt-4 grid gap-2">
                  {flow.slice(0, 4).map(([index, title, desc]) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
                      <p className="pt-1 text-sm font-semibold tracking-tight">{title}</p>
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
            <div className="grid gap-4 md:grid-cols-3">
              {flow.map(([index, title, desc]) => (
                <div key={index} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
                  <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
                  <p className="pt-2 text-base font-semibold tracking-tight">{title}</p>
                  <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Quién está detrás
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Grupo Modernia publica. Verifika2 estructura confianza y trazabilidad.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                La experiencia separa roles: el publicador gestiona el inmueble y el contacto comercial; Verifika2 aporta revisión, portal, áreas privadas y flujo de seguimiento.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <RoleCard title="Grupo Modernia" desc="Publicador y gestor comercial de la cartera inmobiliaria." />
              <RoleCard title="Verifika2" desc="Portal, verificación, trazabilidad, CRM y experiencia privada por perfil." />
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Preguntas frecuentes
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {faqs.map((block) => (
                <div key={block.group} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
                  <p className="text-base font-semibold tracking-tight">{block.group}</p>
                  <div className="mt-4 grid gap-3">
                    {block.items.map(([q, a]) => (
                      <div key={q} className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                        <p className="text-sm font-semibold tracking-tight">{q}</p>
                        <p className="pt-2 text-xs leading-5 text-slate-600">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function RoleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}
