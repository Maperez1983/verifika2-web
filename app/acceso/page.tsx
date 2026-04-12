import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso privado",
  description:
    "Acceso temporal para previsualizar el portal durante la fase beta de Verifika2.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function AccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const next = normalize(params.next) || "/inmuebles";
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
            Acceso privado (beta)
          </h1>
          <p className="pt-3 text-sm leading-6 text-slate-600">
            Mientras terminamos el portal, el acceso a la parte de inmuebles
            está protegido.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Contraseña</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Introduce la contraseña para abrir el portal de inmuebles.
          </p>

          <form method="post" action="/api/portal-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
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

          <div className="pt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
            <p className="text-sm font-semibold">¿Buscabas información?</p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              La landing sigue pública para presentar el producto y explicar la
              verificación.
            </p>
            <div className="pt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/verificacion"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface)]/70"
              >
                Ver verificación
              </Link>
              <Link
                href="/certificacion"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface)]/70"
              >
                Ver premium
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

