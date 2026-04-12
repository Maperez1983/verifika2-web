import type { Metadata } from "next";
import Link from "next/link";

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
  crm: "https://crm.verifika2.com",
};

export default function ProfessionalsPage() {
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
              Acceso profesionales
            </h1>
            <p className="pt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Verifika2 es un sistema modular. El portal es la parte pública; el
              CRM es donde vive la operativa y la documentación que hace posible
              la verificación.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={links.app}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Entrar
            </a>
            <Link
              href={links.portal}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Ver portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
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
                href={links.app}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
              >
                Entrar (Acceso)
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

