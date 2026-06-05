import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso comprador",
  description: "Acceso privado del comprador para consultar solicitudes, visitas y ofertas.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();
const sanitizeNextPath = (value: unknown, fallback: string) => {
  const next = normalize(value);
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
};

export default async function BuyerAccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const next = sanitizeNextPath(params.next, "/comprador");
  const error = normalize(params.error) === "1";

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link href="/inmuebles" className="text-sm font-medium text-white/64 hover:text-white">
            ← Volver a inmuebles
          </Link>
          <p className="pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Área comprador
          </p>
          <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Tu espacio privado para decidir con seguridad
          </h1>
          <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
            Consulta inmuebles visitados, solicitudes, documentación, visitas y estado de cada contacto.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-5">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Acceso comprador</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Usa el mismo teléfono o email con el que solicitaste información y el código que te facilite el equipo.
          </p>

          <form method="post" action="/api/buyer-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              name="contact"
              placeholder="Teléfono o email"
              className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400"
              required
            />
            <input
              name="code"
              placeholder="Ej: CB-ABCD-2345"
              className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none focus:border-slate-400"
              autoComplete="one-time-code"
              required
            />
            {error ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Contacto o código incorrecto. Revisa e inténtalo de nuevo.
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
            >
              Entrar a mi área
            </button>
          </form>
        </div>
        </section>

        <aside className="lg:col-span-7">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Una compra mejor acompañada</p>
            <div className="pt-4 grid gap-3 sm:grid-cols-3">
              <BuyerValue title="Seguimiento" desc="Estado de cada inmueble por el que has preguntado." />
              <BuyerValue title="Documentación" desc="Solicita información y verificación documental." />
              <BuyerValue title="Visitas" desc="Consulta citas y próximos pasos comerciales." />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function BuyerValue({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}
