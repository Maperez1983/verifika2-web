import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso admin",
  description: "Acceso privado al panel interno de Verifika2.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();
const sanitizeNextPath = (value: unknown, fallback: string) => {
  const next = normalize(value);
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.includes("\\")) return fallback;
  if (!next.startsWith("/admin")) return fallback;
  if (next.startsWith("/admin/acceso")) return fallback;
  return next;
};

export default async function AdminAccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const next = sanitizeNextPath(params.next, "/admin");
  const error = normalize(params.error) === "1";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/"
            className="text-sm font-medium text-white/64 hover:text-white"
          >
            ← Volver a la landing
          </Link>
          <p className="pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Consola privada
          </p>
          <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Gestión interna del portal inmobiliario
          </h1>
          <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
            Accede al panel para controlar publicación, leads, propietarios y trazabilidad documental.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-5">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Acceso autorizado</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Introduce la contraseña interna para abrir la consola.
          </p>

          <form method="post" action="/api/admin-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña admin"
              className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400"
              autoComplete="current-password"
              required
            />
            {error ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Contraseña incorrecta. Revisa e inténtalo de nuevo.
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
            >
              Entrar a consola
            </button>
          </form>
        </div>
        </section>

        <aside className="lg:col-span-7">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Operativa privada</p>
            <div className="pt-4 grid gap-3 sm:grid-cols-3">
              <AdminValue title="Publicación" desc="Activa u oculta inmuebles conectados al CRM." />
              <AdminValue title="Leads" desc="Supervisa solicitudes y errores de volcado." />
              <AdminValue title="Propietarios" desc="Entrega accesos privados con inmuebles asignados." />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function AdminValue({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}
