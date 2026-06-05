import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";

export const metadata: Metadata = {
  title: "Portal del propietario",
  description:
    "Área privada para propietarios: seguimiento del estado de la operación, hitos, documentación y comunicación con trazabilidad.",
};

const links = {
  home: "/",
  portal: "/inmuebles",
  pros: "/profesionales",
  app: "https://app.verifika2.com",
  owner: "/owner",
};

const reportRows = [
  ["Leads recibidos", "Quién pregunta y por qué inmueble"],
  ["Citas y agenda", "Visitas previstas, realizadas y pendientes"],
  ["Estado de clientes", "Interesado, visitado, oferta, descartado"],
  ["Anuncio publicado", "Ficha pública, precio, fotos y mensajes comerciales"],
  ["Gestión del intermediario", "Próximos pasos y tareas abiertas"],
];

export default function OwnersPage() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader current="owners" showBack backHref={links.home} backLabel="Landing" />

      <main className="flex-1">
        <section className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Para propietarios y vendedores
              </p>
              <h1 className="pt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Control 360 de la venta de tu inmueble en tiempo real.
              </h1>
              <p className="pt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                No dependas de llamadas sueltas para saber qué ocurre. En Verifika2 puedes seguir citas, interesados,
                agenda, estado documental, anuncio publicado y gestión del intermediario desde tu portal privado.
              </p>
              <div className="pt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={links.owner}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
              >
                Acceso propietario
              </Link>
              <Link
                href={links.portal}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16"
              >
                Ver inmuebles
              </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
              <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
                <p className="text-sm font-semibold">Dashboard propietario</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <OwnerMetric label="Clientes interesados" value="12" />
                  <OwnerMetric label="Visitas agendadas" value="3" />
                  <OwnerMetric label="Documentos revisados" value="8" />
                  <OwnerMetric label="Ofertas en curso" value="1" />
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Información visible</p>
                  <p className="pt-2 text-sm leading-6 text-slate-700">
                    Actividad comercial, agenda, anuncio, hitos y próximos pasos de la operación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold tracking-tight">
              Qué verás dentro
            </p>
            <div className="pt-6 grid gap-3 sm:grid-cols-2">
              <Card
                title="Estado de la operación"
                desc="En qué punto estás y qué falta para el siguiente hito."
              />
              <Card
                title="Hitos"
                desc="Reserva, arras, notaría, entrega de llaves (según el caso)."
              />
              <Card
                title="Documentación"
                desc="Subida, revisada, pendiente: todo en un solo sitio."
              />
              <Card
                title="Comunicación"
                desc="Mensajes con trazabilidad para evitar malentendidos."
              />
            </div>

            <div className="pt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
              <p className="text-sm font-semibold tracking-tight">
                Por qué es importante
              </p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                La operación inmobiliaria genera incertidumbre por falta de
                información y documentos dispersos. El portal del propietario
                reduce fricción: el estado está siempre visible y la información
                se mantiene ordenada.
              </p>
              <div className="pt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={links.app}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Entrar
                </a>
                <Link
                  href={links.pros}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                >
                  Soy profesional
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Acceso</p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              El portal del propietario se accede desde la misma puerta de
              entrada, pero con permisos de propietario/cliente.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <a
                href={links.app}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Acceder
              </a>
              <Link
                href={links.pros}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Acceso profesionales
              </Link>
            </div>
            <p className="pt-5 text-xs leading-5 text-slate-600">
              Si tu inmobiliaria aún no te dio acceso, lo habilitará desde su
              workspace en Verifika2.
            </p>
          </aside>
        </div>

        <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Reporte propietario
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Nada de la venta debería escaparse.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                El propietario recibe una visión clara de leads, citas, clientes, anuncio y estado de gestión sin depender de llamadas aisladas.
              </p>
            </div>
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Ejemplo de panel visible</p>
              <div className="mt-4 grid gap-2">
                {reportRows.map(([label, desc]) => (
                  <ReportRow key={label} label={label} desc={desc} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <ChatWidget scope="owners" defaultPersona="propietario" />
    </div>
  );
}

function OwnerMetric({ label, value }: { label: string; value: string }) {
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

function ReportRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="text-sm text-slate-600">{desc}</span>
    </div>
  );
}
