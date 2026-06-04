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
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <Link href="/inmuebles" className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]">
            Volver a inmuebles
          </Link>
          <h1 className="pt-4 text-3xl font-semibold tracking-tight">
            Acceso comprador
          </h1>
          <p className="pt-3 text-sm leading-6 text-slate-600">
            Consulta tus solicitudes, visitas, ofertas y el estado de cada inmueble.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-tight">Código de acceso</p>
          <p className="pt-2 text-sm leading-6 text-slate-600">
            Usa el mismo teléfono o email con el que solicitaste información y el código que te facilite el equipo.
          </p>

          <form method="post" action="/api/buyer-auth" className="pt-6 grid gap-3">
            <input type="hidden" name="next" value={next} />
            <input
              name="contact"
              placeholder="Teléfono o email"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
              required
            />
            <input
              name="code"
              placeholder="Ej: CB-ABCD-2345"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
              autoComplete="one-time-code"
              required
            />
            {error ? (
              <p className="text-sm text-amber-800">
                Contacto o código incorrecto. Revisa e inténtalo de nuevo.
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
