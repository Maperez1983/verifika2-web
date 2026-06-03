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
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]"
          >
            ← Volver a la landing
          </Link>
          <h1 className="pt-4 text-3xl font-semibold tracking-tight">
            Acceso admin
          </h1>
          <p className="pt-3 text-sm leading-6 text-slate-600">
            Panel interno para gestionar propietarios, leads e inmuebles.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Contraseña admin</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Introduce la contraseña interna para abrir el panel.
          </p>

          <form method="post" action="/api/admin-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña admin"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
              autoComplete="current-password"
              required
            />
            {error ? (
              <p className="text-sm text-amber-800">
                Contraseña incorrecta. Revisa e inténtalo de nuevo.
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
