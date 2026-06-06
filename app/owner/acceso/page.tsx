import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso propietario",
  description:
    "Acceso privado al portal del propietario de Verifika2.",
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

export default async function OwnerAccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const next = sanitizeNextPath(params.next, "/owner");
  const error = normalize(params.error) === "1";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/propietarios"
            className="text-sm font-medium text-white/64 hover:text-white"
          >
            ← Volver a “Portal del propietario”
          </Link>
          <p className="pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Portal del propietario
          </p>
          <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Seguimiento 360 de la venta de tu inmueble
          </h1>
          <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
            Consulta la actividad comercial y documental que la agencia o Verifika2 haya habilitado para tu inmueble.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-5">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Código privado</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Introduce el código facilitado por la agencia que gestiona el inmueble o por Verifika2 si la publicación es directa.
          </p>

          <form method="post" action="/api/owner-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              name="code"
              placeholder="Ej: V2-ABCD-1234"
              className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400"
              autoComplete="one-time-code"
              required
            />
            {error ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Código incorrecto o sin permisos. Revisa e inténtalo de nuevo.
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
            >
              Ver mi dashboard
            </button>
          </form>
        </div>
        </section>

        <aside className="lg:col-span-7">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Qué verás dentro</p>
            <div className="pt-4 grid gap-3 sm:grid-cols-3">
              <OwnerValue title="Clientes" desc="Leads, visitas y ofertas vinculadas a tu inmueble." />
              <OwnerValue title="Agenda" desc="Citas previstas y próximos pasos de la operación." />
              <OwnerValue title="Anuncio" desc="Ficha publicada, métricas y estado documental." />
            </div>
            <p className="pt-5 text-xs leading-5 text-slate-600">
              Este acceso no es un alta abierta. Está vinculado a inmuebles concretos y a los permisos definidos por quien gestiona la operación.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function OwnerValue({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}
