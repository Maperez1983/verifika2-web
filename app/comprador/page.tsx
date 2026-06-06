import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ListingCover from "@/components/listings/ListingCover";
import { fetchPortalListings } from "@/lib/crmPortal";
import { getBuyerSession } from "@/lib/buyerSessionServer";
import { leadHubFetch } from "@/lib/leadHub";
import type { Listing } from "@/lib/listings";
import {
  consentRedirect,
  consentSubjectForBuyer,
  hasPrivacyConsent,
} from "@/lib/privacyConsent";

export const metadata: Metadata = {
  title: "Área comprador",
  description: "Panel privado del comprador para sus solicitudes, visitas y ofertas.",
};

export const dynamic = "force-dynamic";

type BuyerLead = {
  id: string;
  created_at: string;
  intent: string;
  contact: string;
  name: string | null;
  note: string | null;
  listing_id: string | null;
  listing_title: string | null;
  listing_city: string | null;
  status: string;
  scheduled_at: string | null;
  outcome: string | null;
  outcome_note: string | null;
};

type BuyerPreferences = {
  operation: Listing["operation"] | "";
  city: string;
  propertyType: Listing["propertyType"] | "";
  maxPrice: number;
};

async function getBuyerLeads(contact: string): Promise<BuyerLead[]> {
  try {
    const res = await leadHubFetch(`/v1/buyers/leads?contact=${encodeURIComponent(contact)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { leads?: BuyerLead[] };
    return Array.isArray(data.leads) ? data.leads : [];
  } catch {
    return [];
  }
}

function statusLabel(status: string) {
  if (status === "contacted") return "Contactado";
  if (status === "scheduled") return "Tu cita";
  if (status === "done") return "Solicitud finalizada";
  if (status === "rejected") return "Descartado";
  return "Nueva solicitud";
}

function pill(status: string) {
  if (status === "scheduled" || status === "done") return "bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function stageForLead(lead: BuyerLead) {
  if (lead.status === "rejected") return "Descartado";
  if (lead.status === "done") return lead.outcome === "oferta" ? "Tu oferta enviada" : "Tu solicitud finalizada";
  if (lead.outcome === "oferta" || lead.intent === "oferta") return "Tu oferta";
  if (lead.status === "scheduled" || lead.scheduled_at) return "Tu visita agendada";
  if (lead.intent === "visita") return "Tu visita solicitada";
  if (lead.intent === "info" || lead.intent === "documentacion") return "Tu documentación solicitada";
  if (lead.status === "contacted") return "Tu solicitud contactada";
  return "Tu solicitud enviada";
}

function nextActionForLead(lead: BuyerLead) {
  if (lead.status === "rejected") return "Revisar alternativa o descartar definitivamente.";
  if (lead.status === "done") return "Consultar resultado y próximos pasos con el equipo.";
  if (lead.scheduled_at) return "Confirmar asistencia y preparar dudas para la visita.";
  if (lead.intent === "oferta" || lead.outcome === "oferta") return "Esperar valoración de tu oferta y documentación de soporte.";
  if (lead.intent === "visita") return "Esperar confirmación de fecha u ofrecer nueva disponibilidad.";
  return "Solicitar documentación o pedir una visita si el inmueble encaja.";
}

function buyerAlert(leads: BuyerLead[]) {
  const scheduled = leads.filter((lead) => lead.status === "scheduled" || lead.scheduled_at).length;
  const docs = leads.filter((lead) => lead.intent === "info" || lead.intent === "documentacion").length;
  const offers = leads.filter((lead) => lead.intent === "oferta" || lead.outcome === "oferta").length;
  if (scheduled > 0) return `${scheduled} visita tuya necesita revisión.`;
  if (offers > 0) return `${offers} oferta tuya está pendiente de seguimiento.`;
  if (docs > 0) return `${docs} solicitud documental tuya está pendiente de respuesta o seguimiento.`;
  return "Tu área está preparada para ordenar tus visitas, documentación y ofertas.";
}

async function getRecommendedListings(leads: BuyerLead[]) {
  const preferences = inferBuyerPreferences(leads);
  const all = await fetchPortalListings({
    operacion: preferences.operation || undefined,
    ciudad: preferences.city || undefined,
    limit: 24,
  }).catch(() => []);
  const interestedIds = new Set(leads.map((lead) => lead.listing_id).filter(Boolean));
  const scored = all
    .filter((listing) => !interestedIds.has(listing.id))
    .map((listing) => ({ listing, score: recommendationScore(listing, preferences) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  return { preferences, recommendations: scored };
}

function mostCommon<T extends string>(values: T[]): T | "" {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best: T | "" = "";
  let bestCount = 0;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function inferBuyerPreferences(leads: BuyerLead[]): BuyerPreferences {
  const text = `${leads.map((lead) => `${lead.listing_title ?? ""} ${lead.note ?? ""}`).join(" ")}`.toLowerCase();
  const operation: Listing["operation"] | "" = text.includes("alquiler") ? "alquiler" : "venta";
  const city = mostCommon(leads.map((lead) => String(lead.listing_city ?? "").trim()).filter(Boolean));
  return {
    operation,
    city,
    propertyType: "",
    maxPrice: 0,
  };
}

function recommendationScore(listing: Listing, preferences: BuyerPreferences) {
  let score = 45;
  if (preferences.operation && listing.operation === preferences.operation) score += 20;
  if (preferences.city && listing.city.toLowerCase().includes(preferences.city.toLowerCase())) score += 20;
  if (preferences.propertyType && listing.propertyType === preferences.propertyType) score += 10;
  if (listing.certified) score += 10;
  if (preferences.maxPrice > 0 && listing.priceValue <= preferences.maxPrice) score += 10;
  return Math.min(98, score);
}

function preferenceLabel(preferences: BuyerPreferences) {
  const parts = [
    preferences.operation ? (preferences.operation === "alquiler" ? "Alquiler" : "Compra") : "Compra",
    preferences.city || "zona abierta",
    preferences.propertyType || "todo tipo",
  ];
  return parts.join(" · ");
}

export default async function BuyerDashboard() {
  const session = await getBuyerSession();
  if (!session) redirect("/comprador/acceso");
  const accepted = await hasPrivacyConsent("comprador", consentSubjectForBuyer(session));
  if (!accepted) redirect(consentRedirect("/comprador/tratamiento-datos", "/comprador"));

  const leads = await getBuyerLeads(session.contact);
  const visits = leads.filter((lead) => lead.intent === "visita");
  const offers = leads.filter((lead) => lead.intent === "oferta" || lead.outcome === "oferta");
  const active = leads.filter((lead) => ["new", "contacted", "scheduled"].includes(lead.status || "new"));
  const scheduled = leads.filter((lead) => lead.status === "scheduled" || lead.scheduled_at);
  const documents = leads.filter((lead) => lead.intent === "info" || lead.intent === "documentacion");
  const uniqueListings = new Set(leads.map((lead) => lead.listing_id).filter(Boolean)).size;
  const { preferences, recommendations } = await getRecommendedListings(leads);

  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Área comprador
            </p>
            <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
              Seguimiento privado de tu búsqueda
            </h1>
            <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
              Consulta tus inmuebles visitados, tus solicitudes, tus visitas, tus ofertas y la documentación que hayas pedido.
            </p>
          </div>
          <Link
            href="/inmuebles"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
          >
            Ver inmuebles
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Panel comprador
              </p>
              <h2 className="pt-3 max-w-2xl text-2xl font-semibold tracking-tight">
                Tus operaciones inmobiliarias en un solo lugar
              </h2>
              <p className="pt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Cada consulta queda ordenada para que puedas comparar, pedir documentación y seguir tus propios pasos.
              </p>
            </div>
          <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[520px]">
            <HeroStat label="Solicitudes" value={leads.length} />
            <HeroStat label="Activas" value={active.length} />
            <HeroStat label="Tus visitas" value={visits.length} />
            <HeroStat label="Tus ofertas" value={offers.length} />
          </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-12">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] p-6 text-white shadow-sm lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Ficha comprador
            </p>
            <h2 className="pt-3 text-2xl font-semibold tracking-tight">Mi búsqueda activa</h2>
            <p className="pt-3 text-sm leading-6 text-white/72">
              Perfil inferido a partir de tus solicitudes. No se muestran métricas, citas ni actividad de otros interesados.
            </p>
            <div className="pt-5 grid gap-3 sm:grid-cols-3">
              <ProfileMetric label="Preferencia" value={preferenceLabel(preferences)} />
              <ProfileMetric label="Alta" value="Activa y firmada" />
              <ProfileMetric label="Seguimiento" value={`${uniqueListings} inmuebles`} />
            </div>
          </div>
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm lg:col-span-5">
            <p className="text-sm font-semibold tracking-tight">Acciones pendientes</p>
            <div className="pt-4 grid gap-3">
              <ActionItem active={scheduled.length > 0} text="Confirmar o preparar visitas agendadas." />
              <ActionItem active={documents.length > 0} text="Revisar documentación solicitada." />
              <ActionItem active={offers.length > 0} text="Seguir tus ofertas abiertas." />
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-12">
          <div className="rounded-[28px] border border-[#bfdbfe] bg-[#eff6ff] p-5 text-[#102a56] lg:col-span-7">
            <p className="text-sm font-semibold tracking-tight">Próxima acción</p>
            <p className="pt-2 text-sm leading-6">{buyerAlert(leads)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5">
            <HeroStat label="Inmuebles" value={uniqueListings} />
            <HeroStat label="Documentos" value={documents.length} />
            <HeroStat label="Pendientes" value={active.length} />
          </div>
        </section>

        {scheduled.length ? (
          <section className="mb-6 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
            <p className="font-semibold">Tienes {scheduled.length} visita o seguimiento agendado.</p>
            <p className="pt-2 leading-6">
              Revisa tus fichas para confirmar hora, inmueble y próximos pasos de tu solicitud.
            </p>
          </section>
        ) : null}

        <div className="grid gap-4">
          {leads.length === 0 ? (
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-sm">
              <p className="text-lg font-semibold tracking-tight">Sin solicitudes todavía</p>
              <p className="mx-auto max-w-xl pt-3 text-sm leading-6 text-slate-600">
                Cuando solicites información, documentación, una visita u oferta desde el portal, aparecerá aquí el estado de tu solicitud.
              </p>
              <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <EmptyBenefit title="Visitados" desc="Inmuebles consultados y vistos." />
                <EmptyBenefit title="Documentación" desc="Solicitudes y respuesta del equipo." />
                <EmptyBenefit title="Seguimiento" desc="Tus visitas, ofertas y solicitudes." />
              </div>
              <div className="pt-5">
                <Link
                  href="/inmuebles"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                >
                  Buscar inmuebles
                </Link>
              </div>
            </div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>

        <section className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold tracking-tight">Nuevos inmuebles que encajan contigo</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Recomendaciones generadas con inmuebles reales publicados y tu historial de interés.
              </p>
            </div>
            <Link
              href="/inmuebles"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Ver todos
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.length === 0 ? (
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5 text-sm leading-6 text-slate-700 md:col-span-2 lg:col-span-3">
                Aún no hay recomendaciones suficientes. Cuando se publiquen inmuebles compatibles con tu búsqueda aparecerán aquí.
              </div>
            ) : (
              recommendations.map(({ listing, score }) => (
                <RecommendedListingCard key={listing.id} listing={listing} score={score} preferences={preferences} />
              ))
            )}
          </div>
        </section>

        {leads.length > 1 ? (
          <section className="mt-6 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Comparativa rápida</p>
              <p className="pt-2 text-sm leading-6 text-slate-600">
                Resumen de tus inmuebles consultados para decidir con menos ruido.
              </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="border-b border-[color:var(--border)] py-3 pr-4">Inmueble</th>
                    <th className="border-b border-[color:var(--border)] py-3 pr-4">Estado de tu solicitud</th>
                    <th className="border-b border-[color:var(--border)] py-3 pr-4">Tu próximo paso</th>
                    <th className="border-b border-[color:var(--border)] py-3 pr-4">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 8).map((lead) => (
                    <tr key={lead.id}>
                      <td className="border-b border-[color:var(--border)] py-3 pr-4 font-medium">
                        {lead.listing_title || "Inmueble solicitado"}
                      </td>
                      <td className="border-b border-[color:var(--border)] py-3 pr-4">{stageForLead(lead)}</td>
                      <td className="border-b border-[color:var(--border)] py-3 pr-4 text-slate-600">{nextActionForLead(lead)}</td>
                      <td className="border-b border-[color:var(--border)] py-3 pr-4 text-slate-600">
                        {new Date(lead.created_at).toLocaleDateString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/10 px-4 py-3">
      <p className="text-xs font-medium text-white/60">{label}</p>
      <p className="pt-1 text-sm font-semibold leading-5 text-white">{value}</p>
    </div>
  );
}

function ActionItem({ active, text }: { active: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <span className={`mt-0.5 h-5 w-5 rounded-full text-center text-xs font-semibold leading-5 ${active ? "bg-[#0B1D33] text-white" : "bg-slate-200 text-slate-600"}`}>
        {active ? "!" : "·"}
      </span>
      <p className="text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function EmptyBenefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-1 text-xs leading-5 text-slate-600">{desc}</p>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="pt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function matchReasons(listing: Listing, preferences: BuyerPreferences) {
  const reasons: string[] = [];
  if (preferences.operation && listing.operation === preferences.operation) reasons.push("misma operación");
  if (preferences.city && listing.city.toLowerCase().includes(preferences.city.toLowerCase())) reasons.push("zona compatible");
  if (listing.certified) reasons.push("verificación reforzada");
  if (listing.propertyType) reasons.push(listing.propertyType);
  return reasons.slice(0, 3);
}

function RecommendedListingCard({
  listing,
  score,
  preferences,
}: {
  listing: Listing;
  score: number;
  preferences: BuyerPreferences;
}) {
  const reasons = matchReasons(listing, preferences);
  return (
    <div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
      <ListingCover
        id={listing.id}
        src={listing.photo}
        title={listing.title}
        location={listing.city}
        label={`${score}% encaje`}
      />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#0B1D33] px-3 py-1 text-xs font-medium text-white">
            Recomendado
          </span>
          <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
            {listing.operation === "alquiler" ? "Alquiler" : "Venta"} · {listing.propertyType}
          </span>
        </div>
        <h3 className="pt-4 text-base font-semibold tracking-tight">{listing.title}</h3>
        <p className="pt-2 text-sm text-slate-600">{listing.city}</p>
        <p className="pt-3 text-xl font-semibold tracking-tight">{listing.priceLabel}</p>
        <div className="pt-4 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <span key={reason} className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {reason}
            </span>
          ))}
        </div>
        <div className="pt-5 grid gap-2">
          <Link
            href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&motivo=documentacion&next=${encodeURIComponent("/comprador")}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
          >
            Me interesa
          </Link>
          <Link
            href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=info&motivo=dossier_basico&next=${encodeURIComponent("/comprador")}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
          >
            Verificar antes de ofertar
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/interes?listing=${encodeURIComponent(listing.id)}&tipo=visita&next=${encodeURIComponent("/comprador")}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Visita
            </Link>
            <Link
              href={`/inmuebles/${encodeURIComponent(listing.id)}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm font-medium hover:bg-[color:var(--surface-2)]"
            >
              Anuncio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: BuyerLead }) {
  const stage = stageForLead(lead);
  const nextAction = nextActionForLead(lead);
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition hover:border-slate-300">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill(lead.status)}`}>
              {statusLabel(lead.status)}
            </span>
            <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
              {lead.intent}
            </span>
          </div>
          <h2 className="pt-4 text-lg font-semibold tracking-tight">
            {lead.listing_title || "Inmueble solicitado"}
          </h2>
          <p className="pt-2 text-sm text-slate-600">
            {lead.listing_city || "Ubicación bajo solicitud"} · {new Date(lead.created_at).toLocaleString("es-ES")}
          </p>
          {lead.scheduled_at ? (
            <p className="pt-3 text-sm text-slate-700">
              Tu cita: <span className="font-medium">{new Date(lead.scheduled_at).toLocaleString("es-ES")}</span>
            </p>
          ) : null}
          {lead.outcome || lead.outcome_note ? (
            <p className="pt-2 text-sm text-slate-700">
              Respuesta sobre tu solicitud: <span className="font-medium">{lead.outcome || "Pendiente"}</span>
              {lead.outcome_note ? ` · ${lead.outcome_note}` : ""}
            </p>
          ) : null}
          {lead.note ? (
            <p className="pt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">
              {lead.note}
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 sm:grid-cols-3">
            <BuyerSignal label="Tu fase" value={stage} />
            <BuyerSignal label="Seguridad" value="Verificación documental" />
            <BuyerSignal label="Tu próximo paso" value={nextAction} />
          </div>
          <BuyerTimeline lead={lead} />
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:w-[180px]">
          {lead.listing_id ? (
            <Link
              href={`/inmuebles/${encodeURIComponent(lead.listing_id)}`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]"
            >
              Ver anuncio
            </Link>
          ) : null}
          <Link
            href={`/interes${lead.listing_id ? `?listing=${encodeURIComponent(lead.listing_id)}&tipo=info` : ""}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
          >
            Documentación
          </Link>
          {lead.listing_id ? (
            <Link
              href={`/interes?listing=${encodeURIComponent(lead.listing_id)}&tipo=info&motivo=dossier_basico&next=${encodeURIComponent("/comprador")}`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#F2C14E] px-4 text-sm font-semibold text-[#0B1D33] hover:bg-[#ffd56f]"
            >
              Verificar
            </Link>
          ) : null}
          <Link
            href={`/interes${lead.listing_id ? `?listing=${encodeURIComponent(lead.listing_id)}&tipo=visita` : ""}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium hover:bg-[color:var(--surface-2)]"
          >
            Nueva visita
          </Link>
        </div>
      </div>
    </div>
  );
}

function BuyerSignal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="pt-1 text-sm font-medium leading-5 text-slate-800">{value}</p>
    </div>
  );
}

function BuyerTimeline({ lead }: { lead: BuyerLead }) {
  const steps = [
    { label: "Solicitado", active: true },
    { label: "Contactado", active: ["contacted", "scheduled", "done"].includes(lead.status) },
    { label: "Tu visita / docs", active: Boolean(lead.scheduled_at) || lead.intent === "visita" || lead.intent === "info" || lead.intent === "documentacion" },
    { label: "Tu oferta", active: lead.intent === "oferta" || lead.outcome === "oferta" },
    { label: "Finalizado", active: lead.status === "done" },
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {steps.map((step) => (
        <span
          key={step.label}
          className={`rounded-full px-3 py-1 text-xs font-medium ${step.active ? "bg-[#0B1D33] text-white" : "bg-[color:var(--surface-2)] text-slate-500"}`}
        >
          {step.label}
        </span>
      ))}
    </div>
  );
}
