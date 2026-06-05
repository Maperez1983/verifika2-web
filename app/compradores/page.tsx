import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

export const metadata: Metadata = {
  title: "Compradores",
  description:
    "Compra o alquila con más seguridad: inmuebles verificados, seguimiento privado, visitas, documentación y trazabilidad.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  buyerAccess: "/comprador",
  verification: "/verificacion",
  certification: "/certificacion",
};

const benefits = [
  {
    title: "Menos incertidumbre jurídica",
    desc: "Antes de avanzar, el anuncio muestra señales de revisión documental: titularidad, situación registral y cargas cuando estén disponibles.",
  },
  {
    title: "Seguimiento de inmuebles",
    desc: "Cada solicitud queda ordenada en tu área privada para comparar, recordar visitas y consultar próximos pasos.",
  },
  {
    title: "Documentación bajo solicitud",
    desc: "Puedes pedir información documental o verificación adicional sin perder el hilo comercial de la operación.",
  },
  {
    title: "Comunicación trazable",
    desc: "Las visitas, ofertas y consultas quedan registradas para que el equipo pueda darte una respuesta más precisa.",
  },
];

const steps = [
  ["01", "Explora inmuebles verificados", "Filtra oportunidades y revisa señales de seguridad documental."],
  ["02", "Solicita información o visita", "El sistema crea tu perfil comprador y vincula el interés al inmueble."],
  ["03", "Accede a tu área privada", "Consulta estado, visitas, documentación y próximos pasos."],
];

export default function BuyersLandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="buyer" showBack backHref={links.home} backLabel="Landing" />

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Experiencia comprador
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Compra o alquila con información, trazabilidad y menos riesgo.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                Verifika2 no es solo un escaparate. Es un portal donde el comprador puede revisar inmuebles verificados,
                solicitar documentación, pedir visitas y mantener el seguimiento de cada operación en su área privada.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={links.portal}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
                >
                  Ver inmuebles
                </Link>
                <Link
                  href={links.buyerAccess}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16"
                >
                  Acceso comprador
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm font-semibold">Área comprador</p>
                    <p className="pt-1 text-xs text-slate-500">Seguimiento privado de búsqueda</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Verificado
                  </span>
                </div>
                <div className="pt-5 grid gap-3">
                  <PreviewRow label="Inmuebles consultados" value="4" />
                  <PreviewRow label="Visitas solicitadas" value="2" />
                  <PreviewRow label="Documentación pendiente" value="1" />
                  <PreviewRow label="Ofertas en seguimiento" value="1" />
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Próximo paso
                  </p>
                  <p className="pt-2 text-sm leading-6 text-slate-700">
                    Solicitar información documental antes de formalizar reserva.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-4 md:grid-cols-4">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.title} {...benefit} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recorrido
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                De la búsqueda al seguimiento privado.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                La experiencia está pensada para que no pierdas información entre portales, llamadas y mensajes.
                Cada interés queda conectado al inmueble y al equipo que gestiona la operación.
              </p>
            </div>
            <div className="grid gap-3">
              {steps.map(([index, title, desc]) => (
                <div key={index} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
                  <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
                  <p className="pt-2 text-base font-semibold tracking-tight">{title}</p>
                  <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] p-6 text-white shadow-[var(--shadow-soft)] md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#F2C14E]">Decide con más información antes de reservar.</p>
                  <p className="pt-3 max-w-3xl text-sm leading-6 text-white/72">
                    Empieza viendo inmuebles verificados o entra en tu área privada si ya tienes un código de acceso.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]" href={links.portal}>
                    Ver inmuebles
                  </Link>
                  <Link className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/16" href={links.buyerAccess}>
                    Acceso comprador
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <ChatWidget scope="buyer" defaultPersona="comprador" />
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <strong className="text-sm">{value}</strong>
    </div>
  );
}

function BenefitCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}
