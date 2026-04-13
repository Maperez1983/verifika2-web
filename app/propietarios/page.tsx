import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";

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

export default function OwnersPage() {
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
              Portal del propietario
            </h1>
            <p className="pt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Un área privada para seguir el estado de tu operación: hitos,
              documentación y comunicación, sin perder contexto.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={links.app}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Acceso
            </a>
            <Link
              href={links.owner}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Owner Portal
            </Link>
            <Link
              href={links.portal}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Ver inmuebles
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
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
      </main>
      <ChatWidget scope="owners" defaultPersona="propietario" />
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
