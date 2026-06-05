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
  const connectedServices = [
    hubConfig?.hubConfigured,
    hubConfig?.databaseConfigured,
    hubConfig?.slackConfigured,
    hubConfig?.crmConfigured,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Consola privada
            </p>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight">Control del portal inmobiliario</h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Supervisa publicación, propietarios, leads, checklist documental y sincronización con CRM desde una consola operativa.
            </p>
            <p className="pt-3 text-xs text-white/52">
              Acceso interno protegido. Los cambios de publicación afectan al portal público.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/16"
            >
              Landing
            </Link>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Inmuebles sincronizados" value={listings.length} detail="Última lectura del CRM" />
          <Metric label="Servicios conectados" value={`${connectedServices}/4`} detail="Hub, DB, Slack y CRM" />
          <Metric label="Área propietario" value="Activa" detail="Códigos y trazabilidad" />
          <Metric label="Estado portal" value="Operativo" detail="Publicación desde CRM" />
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <LinkCard
            eyebrow="Propietarios"
            title="Códigos de acceso"
            desc="Crea códigos privados y vincúlalos a uno o varios inmuebles."
            href="/admin/owners"
          />
          <LinkCard
            eyebrow="Comercial"
            title="Leads"
            desc="Revisa solicitudes, errores de CRM y trazabilidad por inmueble."
            href="/admin/leads"
          />
          <LinkCard
            eyebrow="Inventario"
            title="Inmuebles"
            desc="Gestiona publicación, checklist, hitos y firma por ficha."
            href="/admin/listings"
          />
        </div>

        <div className="pt-6 grid gap-4 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight">Estado del hub</p>
                  <p className="pt-2 text-sm leading-6 text-slate-600">
                    Monitor técnico de las conexiones que alimentan el portal privado.
                  </p>
                </div>
                <span className="rounded-full bg-[#0B1D33] px-3 py-1 text-xs font-semibold text-white">
                  {connectedServices}/4 OK
                </span>
              </div>
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
              <p className="text-sm font-semibold tracking-tight">Inmuebles recientes</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Acceso rápido para revisar publicación, checklist documental e hitos.
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
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-[color:var(--surface)]"
                    >
                      <span className="block font-semibold">{l.title}</span>
                      <span className="block pt-1 text-xs text-slate-600">{l.city} · {l.priceLabel}</span>
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

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="pt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function LinkCard({ eyebrow, title, desc, href }: { eyebrow: string; title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <p className="pt-4 text-sm font-medium group-hover:underline">Abrir panel</p>
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
