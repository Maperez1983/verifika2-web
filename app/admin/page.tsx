import type { Metadata } from "next";
import Link from "next/link";
import { fetchPortalListings } from "@/lib/crmPortal";
import { leadHubFetch } from "@/lib/leadHub";

export const metadata: Metadata = {
  title: "Admin · Verifika2",
  description: "Panel interno para gestionar owner codes, leads y checklist (beta).",
};

export const dynamic = "force-dynamic";

type HubConfig = {
  ok: boolean;
  hubConfigured: boolean;
  slackConfigured: boolean;
  databaseConfigured: boolean;
  crmConfigured: boolean;
};

async function getHubConfig(): Promise<HubConfig | null> {
  try {
    const res = await leadHubFetch("/v1/config");
    if (!res.ok) return null;
    return (await res.json()) as HubConfig;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const hubConfig = await getHubConfig();
  const listings = await fetchPortalListings({ limit: 12 }).catch(() => []);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Interno
            </p>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Admin</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Genera códigos de propietario, revisa leads y configura checklist
              y hitos por inmueble (beta).
            </p>
            <p className="pt-3 text-xs text-slate-500">
              Consejo: mantén este panel protegido con la contraseña del portal
              mientras está en beta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Landing
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <LinkCard
            title="Owners (códigos)"
            desc="Crea un código V2-XXXX-XXXX y vincúlalo a uno o varios inmuebles."
            href="/admin/owners"
          />
          <LinkCard
            title="Leads"
            desc="Revisa solicitudes de info/visita/contacto y la trazabilidad."
            href="/admin/leads"
          />
          <LinkCard
            title="Inmuebles"
            desc="Accesos rápidos a la ficha admin por inmueble."
            href="/admin/listings"
          />
        </div>

        <div className="pt-6 grid gap-4 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Estado del hub</p>
              <div className="pt-4 grid gap-3 sm:grid-cols-2">
                <StatusRow label="Hub token" ok={hubConfig?.hubConfigured} fallback="No configurado" />
                <StatusRow label="Database" ok={hubConfig?.databaseConfigured} fallback="Sin DB" />
                <StatusRow label="Slack" ok={hubConfig?.slackConfigured} fallback="No configurado" />
                <StatusRow label="CRM sink" ok={hubConfig?.crmConfigured} fallback="No configurado" />
              </div>
              <p className="pt-4 text-xs text-slate-500">
                Si ves “No configurado”, revisa variables del servicio en Render.
              </p>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-tight">Últimos inmuebles</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Acceso rápido para generar checklist / hitos.
              </p>
              <div className="pt-4 grid gap-2">
                {listings.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No hay inmuebles (o el CRM no responde). Revisa `CRM_ORIGIN`.
                  </p>
                ) : (
                  listings.slice(0, 8).map((l) => (
                    <Link
                      key={l.id}
                      href={`/admin/listings/${encodeURIComponent(l.id)}`}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm hover:bg-[color:var(--surface)]"
                    >
                      <span className="font-semibold">{l.title}</span>
                      <span className="text-slate-600"> · {l.city}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function LinkCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm hover:border-slate-300"
    >
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <p className="pt-4 text-sm font-medium hover:underline">Abrir</p>
    </Link>
  );
}

function StatusRow({ label, ok, fallback }: { label: string; ok?: boolean; fallback: string }) {
  const status = ok ? "OK" : fallback;
  const tone = ok ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800";
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>
    </div>
  );
}

