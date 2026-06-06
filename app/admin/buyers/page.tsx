import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · Compradores",
  description: "Activa accesos y servicios internos para compradores.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalize(value: unknown) {
  return String(Array.isArray(value) ? value[0] : value ?? "").trim();
}

export default async function BuyersAdminPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const created = normalize(params.created) === "1";
  const code = normalize(params.code);
  const contact = normalize(params.contact);
  const error = normalize(params.error);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-medium text-white/64 hover:text-white">
              ← Volver a admin
            </Link>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Servicios de comprador</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Genera o actualiza el acceso del comprador y habilita servicios internos desde administración.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/leads"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Leads
            </Link>
            <Link
              href="/comprador/acceso"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Acceso comprador
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {created && code ? (
          <div className="mb-6 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-950">
            <p className="font-semibold">Acceso de comprador generado/actualizado.</p>
            <p className="pt-2 leading-6">
              Contacto: <span className="font-medium">{contact || "Sin contacto"}</span> · Código:{" "}
              <span className="font-semibold">{code}</span>
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <p className="font-semibold">No se pudo guardar el comprador.</p>
            <p className="pt-2 leading-6 text-amber-900/90">{error}</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Alta o actualización</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Si el contacto ya existe, se actualiza su código y los servicios habilitados.
              </p>
              <form method="post" action="/api/admin/buyers/create" className="pt-6 grid gap-3">
                <input
                  name="name"
                  placeholder="Nombre comprador (opcional)"
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <input
                  name="contact"
                  placeholder="Email o teléfono del comprador"
                  required
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

                <div className="grid gap-2">
                  <ServiceCheck
                    value="purchase_tracking"
                    title="Tracking de compraventa"
                    desc="Itinerario privado: reserva, verificación, financiación, arras, notaría y llaves."
                  />
                  <ServiceCheck
                    value="document_verification_basic"
                    title="Verificación documental básica"
                    desc="Habilita seguimiento interno del servicio básico de revisión documental."
                  />
                  <ServiceCheck
                    value="document_verification_full"
                    title="Dossier documental completo"
                    desc="Habilita seguimiento interno del dossier ampliado."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Guardar acceso y servicios
                </button>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Funcionamiento</p>
              <div className="pt-4 grid gap-3 text-sm leading-6 text-slate-700">
                <p className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  El comprador no contrata nada directamente desde su área.
                </p>
                <p className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  Administración habilita los servicios y el portal solo muestra lo que esté activo.
                </p>
                <p className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                  Si no hay servicio activo, no aparece el itinerario avanzado.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ServiceCheck({ value, title, desc }: { value: string; title: string; desc: string }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-white">
      <input type="checkbox" name="services" value={value} className="mt-1" />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block pt-1 text-xs leading-5 text-slate-600">{desc}</span>
      </span>
    </label>
  );
}
