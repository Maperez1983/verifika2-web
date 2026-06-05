import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso privado",
  description:
    "Acceso privado al portal inmobiliario de Verifika2.",
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
  return next;
};

export default async function AccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const next = sanitizeNextPath(params.next, "/inmuebles");
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
            Portal inmobiliario privado
          </p>
          <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Inmuebles verificados con acceso controlado
          </h1>
          <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
            Entra para consultar anuncios, solicitar información y operar sobre inmuebles revisados documentalmente.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Acceso seguro</p>
            <p className="pt-2 text-sm leading-6 text-slate-600">
              Introduce la contraseña para abrir el portal privado de inmuebles.
            </p>

            <form method="post" action="/api/portal-auth" className="pt-6 grid gap-3">
              <input type="hidden" name="next" value={next} />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
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
                Entrar al portal
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-7">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Qué protege este acceso</p>
            <div className="pt-4 grid gap-3 sm:grid-cols-3">
              <TrustItem title="Verificación" desc="Anuncios revisados documentalmente antes de publicarse." />
              <TrustItem title="Trazabilidad" desc="Solicitudes y visitas quedan registradas en el flujo." />
              <TrustItem title="Privacidad" desc="Acceso controlado para operar con información sensible." />
            </div>
            <div className="pt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/verificacion"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
              >
                Ver verificación
              </Link>
              <Link
                href="/certificacion"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
              >
                Certificación premium
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}
