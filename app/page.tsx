import Image from "next/image";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

const links = {
  portal: "/inmuebles",
  owners: "/propietarios",
  ownerAccess: "/owner",
  buyer: "/comprador",
  pros: "/profesionales",
  publish: "/publicar",
  app: "https://app.verifika2.com",
  crm: "https://crm.verifika2.com",
};

const advantages = [
  {
    title: "Seguridad jurídica",
    desc: "Inmuebles analizados documentalmente antes de presentarse como oportunidad: titularidad, situación registral y cargas.",
    proof: "Nota simple, titularidad, situación registral, validación de cargas y documentación comercial.",
  },
  {
    title: "CRM inmobiliario",
    desc: "Captaciones, encargos, compradores, visitas, ofertas, agenda y actividad en una misma ficha operativa.",
    proof: "Cada lead del portal entra como comprador vinculado al inmueble.",
  },
  {
    title: "Inteligencia artificial",
    desc: "Asistente comercial para compradores y propietarios, ayuda en anuncios, captación y clasificación de interés.",
    proof: "El chat entiende intención, recoge datos y deriva al flujo correcto.",
  },
  {
    title: "Transparencia comercial",
    desc: "Propietarios con dashboard privado: leads, citas, clientes interesados, hitos, documentos y anuncio publicado.",
    proof: "Menos llamadas de seguimiento, más confianza en la operación.",
  },
];

const audiences = [
  {
    title: "Inmobiliarias",
    badge: "Operativa",
    desc: "Publican con control, reducen tareas manuales y convierten cada contacto en un comprador gestionable.",
    href: links.pros,
    cta: "Probar como inmobiliaria",
    bullets: ["CRM + portal", "Leads y citas", "IA comercial", "Control documental"],
  },
  {
    title: "Particulares propietarios",
    badge: "Confianza",
    desc: "Ven qué ocurre con su inmueble sin depender de llamadas dispersas ni capturas de pantalla.",
    href: links.owners,
    cta: "Ver ventajas para propietario",
    bullets: ["Reportes", "Clientes interesados", "Documentos", "Estado del anuncio"],
  },
  {
    title: "Compradores",
    badge: "Seguridad",
    desc: "Encuentran inmuebles con más contexto, piden visita y conservan un área privada de seguimiento.",
    href: links.portal,
    cta: "Explorar inmuebles",
    bullets: ["Verificación", "Visitas", "Ofertas", "Área comprador"],
  },
];

const crmRows = [
  ["Lead comprador", "Perfil creado", "CRM"],
  ["Cita visita", "Agenda", "Propietario visible"],
  ["Oferta", "Seguimiento", "Comprador privado"],
  ["Documento", "Validación", "Anuncio verificado"],
];

const aiExamples = [
  "¿Este inmueble está verificado?",
  "Quiero visitar esta semana",
  "Soy propietario y quiero publicar",
  "Prepara un resumen comercial",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader />

      <main className="flex-1">
        <section className="border-b border-[color:var(--border)] bg-[#0B1D33] text-white">
          <div className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-6xl gap-10 px-6 py-10 md:min-h-[740px] md:py-14 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold text-white/82">
                  Portal inmobiliario premium
                </span>
                <span className="inline-flex rounded-full bg-[#F2C14E] px-3 py-1 text-xs font-semibold text-[#1A1A1A]">
                  Seguridad jurídica + CRM + IA
                </span>
              </div>

              <div className="grid gap-5">
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight md:text-6xl">
                  ¿Cansado de la inseguridad jurídica de los portales inmobiliarios tradicionales?
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  Los inmuebles publicados en Verifika2 han sido analizados
                  documentalmente: titularidad, situación registral, validación
                  de cargas y evidencias clave para que compradores, propietarios
                  e inmobiliarias trabajen con más seguridad.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex h-12 items-center justify-center rounded-full bg-[#F2C14E] px-6 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6CD68]" href={links.pros}>
                  Solicitar alta
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/16" href={links.portal}>
                  Ver portal
                </Link>
                <a className="inline-flex h-12 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold text-white/70 hover:text-white" href={links.crm}>
                  Acceso CRM
                </a>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <HeroMetric value="Jurídico" label="titularidad, registro y cargas" />
                <HeroMetric value="Comercial" label="leads, visitas y ofertas" />
                <HeroMetric value="Privado" label="dashboards por perfil" />
              </div>
            </div>

            <HeroShowcase />
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-4 md:grid-cols-4">
              {advantages.map((item) => (
                <AdvantageCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Para todas las partes
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  La misma operación, tres experiencias que generan confianza.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                  La web debe vender una ventaja evidente: cada usuario ve lo
                  que necesita. La inmobiliaria opera, el propietario entiende
                  el avance y el comprador decide con más seguridad.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {audiences.map((item) => (
                  <AudienceCard key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <LegalPreview />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Seguridad jurídica
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                El anuncio deja de ser una promesa y pasa a estar respaldado por revisión documental.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                Un comprador no solo pregunta precio y metros. Quiere saber quién
                es titular, cuál es la situación registral, si existen cargas y
                qué documentación respalda el anuncio. Verifika2 convierte esa
                tranquilidad en una parte visible del producto.
              </p>
              <div className="mt-6 grid gap-3">
                <ProofLine title="Antes de visitar" desc="El comprador ve estado documental y señales de fiabilidad." />
                <ProofLine title="Antes de reservar" desc="La agencia puede explicar titularidad, cargas y situación registral con base documental." />
                <ProofLine title="Durante la venta" desc="Propietario y equipo comparten hitos y documentación." />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[#101828] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                CRM inmobiliario
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Cada interacción de la web termina en una ficha accionable.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                El portal no puede ser un escaparate aislado. Cuando entra un
                interesado, el CRM debe crear comprador, vincularlo al inmueble,
                registrar intención y activar seguimiento comercial.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6CD68]" href={links.crm}>
                  Ver CRM
                </a>
                <Link className="inline-flex h-11 items-center justify-center rounded-full border border-white/16 bg-white/8 px-5 text-sm font-semibold hover:bg-white/14" href={links.pros}>
                  Alta inmobiliaria
                </Link>
              </div>
            </div>
            <CrmPreview />
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <AiPreview />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Inteligencia artificial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                IA práctica, no decorativa: ayuda a captar, responder y operar.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                El chat y los asistentes deben resolver tareas reales: explicar
                verificación, recoger datos, diferenciar comprador y propietario,
                generar próximos pasos y alimentar el CRM.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <SmallBenefit title="Comprador" desc="Resuelve dudas y solicita visita." />
                <SmallBenefit title="Propietario" desc="Entiende publicación, reportes y estado." />
                <SmallBenefit title="Agencia" desc="Prioriza leads y reduce trabajo repetitivo." />
                <SmallBenefit title="Anuncio" desc="Mejora textos y estructura comercial." />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Áreas privadas
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Dashboards que convierten transparencia en producto.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                  La web gana valor cuando el usuario vuelve. El propietario
                  vuelve para ver actividad; el comprador vuelve para seguir sus
                  visitas, ofertas y anuncios consultados.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PrivateDashboard title="Dashboard propietario" href={links.ownerAccess} metrics={["Leads", "Citas", "Clientes", "Anuncio"]} />
                <PrivateDashboard title="Área comprador" href={links.buyer} metrics={["Consultas", "Visitas", "Ofertas", "Código"]} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[#0B1D33] text-white shadow-[var(--shadow-soft)]">
              <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#F2C14E]">
                    Una web así vende más que inmuebles: vende confianza y control.
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72 md:text-base">
                    Para una inmobiliaria es captación y CRM. Para un propietario,
                    transparencia. Para un comprador, seguridad. Para todos,
                    menos incertidumbre y una experiencia más profesional.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6CD68]" href={links.pros}>
                    Quiero darme de alta
                  </Link>
                  <Link className="inline-flex h-11 items-center justify-center rounded-full border border-white/18 bg-white/10 px-5 text-sm font-semibold hover:bg-white/16" href={links.portal}>
                    Ver inmuebles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <ChatWidget scope="landing" defaultPersona="comprador" />
    </div>
  );
}

function HeroShowcase() {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/8 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/grupo_modernia_logo.png" alt="Grupo Modernia" width={42} height={42} className="h-10 w-10 object-contain" />
            <div>
              <p className="text-sm font-semibold">Grupo Modernia</p>
              <p className="text-xs text-slate-500">Operación conectada</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Verificado
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
            <div className="min-h-[190px] rounded-2xl bg-[linear-gradient(135deg,#DDE6EF,#B8C6D5)] p-4">
              <div className="h-full rounded-xl border border-white/70 bg-white/38" />
            </div>
            <div className="grid gap-3">
              <MiniStatus title="Seguridad jurídica" value="Titularidad y cargas" tone="emerald" />
              <MiniStatus title="Lead comprador" value="Perfil creado" tone="blue" />
              <MiniStatus title="Propietario" value="Reporte visible" tone="amber" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold">Ejemplo de operación</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>Anuncio publicado</span>
                <strong>CRM → Portal</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Comprador interesado</span>
                <strong>Lead → Cliente</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Propietario informado</span>
                <strong>Dashboard</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
      <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/62">{label}</p>
    </div>
  );
}

function AdvantageCard({ title, desc, proof }: { title: string; desc: string; proof: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
      <p className="mt-4 rounded-2xl bg-[color:var(--surface-2)] px-3 py-2 text-xs font-medium leading-5 text-slate-700">
        {proof}
      </p>
    </div>
  );
}

function AudienceCard({
  title,
  badge,
  desc,
  href,
  cta,
  bullets,
}: {
  title: string;
  badge: string;
  desc: string;
  href: string;
  cta: string;
  bullets: string[];
}) {
  return (
    <Link className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]" href={href}>
      <span className="rounded-full bg-[#F2C14E] px-3 py-1 text-xs font-semibold text-[#1A1A1A]">
        {badge}
      </span>
      <p className="mt-4 text-lg font-semibold tracking-tight">{title}</p>
      <p className="mt-3 min-h-[96px] text-sm leading-6 text-slate-600">{desc}</p>
      <div className="mt-5 grid gap-2">
        {bullets.map((item) => (
          <span key={item} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-xs font-medium text-slate-700">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-[#0B1D33] group-hover:underline">{cta}</p>
    </Link>
  );
}

function LegalPreview() {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 shadow-[var(--shadow-card)]">
      <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Dossier del inmueble</p>
            <p className="mt-1 text-xs text-slate-500">Visible en el anuncio premium</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Apto
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          <DocumentRow title="Titularidad" status="Validada" />
          <DocumentRow title="Situación registral" status="Analizada" />
          <DocumentRow title="Cargas" status="Revisadas" />
          <DocumentRow title="Datos del anuncio" status="Contrastados" />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
            Ejemplo de mensaje al comprador
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            Este inmueble ha sido analizado documentalmente antes de su publicación en el portal.
          </p>
        </div>
      </div>
    </div>
  );
}

function CrmPreview() {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/8 p-4">
      <div className="rounded-[22px] bg-white p-5 text-[#0B1D33]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Ficha CRM del inmueble</p>
            <p className="mt-1 text-xs text-slate-500">Actividad comercial en tiempo real</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Inmobiliaria
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>Evento</span>
            <span>Estado</span>
            <span>Salida</span>
          </div>
          {crmRows.map(([event, status, output]) => (
            <div key={event} className="grid grid-cols-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
              <span>{event}</span>
              <strong>{status}</strong>
              <span>{output}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniKpi value="18" label="leads" />
          <MiniKpi value="6" label="citas" />
          <MiniKpi value="3" label="ofertas" />
        </div>
      </div>
    </div>
  );
}

function AiPreview() {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 shadow-[var(--shadow-card)]">
      <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Asistente IA Verifika2</p>
            <p className="mt-1 text-xs text-slate-500">Comprador, propietario y equipo comercial</p>
          </div>
          <span className="rounded-full bg-[#0B1D33] px-3 py-1 text-xs font-semibold text-white">
            Online
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          {aiExamples.map((item, index) => (
            <div key={item} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${index % 2 === 0 ? "bg-slate-100 text-slate-800" : "ml-auto bg-[#0B1D33] text-white"}`}>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">Resultado</p>
          <p className="mt-1 text-sm leading-6 text-emerald-900">
            Contacto recogido, intención clasificada y lead enviado al CRM.
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivateDashboard({ title, href, metrics }: { title: string; href: string; metrics: string[] }) {
  return (
    <Link className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm hover:bg-[color:var(--surface-2)]" href={href}>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <div className="mt-4 grid gap-3">
        {metrics.map((metric, index) => (
          <div key={metric} className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <span className="text-sm text-slate-700">{metric}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-[#0B1D33]">Abrir demo</p>
    </Link>
  );
}

function DocumentRow({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
      <span className="text-sm text-slate-700">{title}</span>
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
        {status}
      </span>
    </div>
  );
}

function ProofLine({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function SmallBenefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function MiniStatus({ title, value, tone }: { title: string; value: string; tone: "emerald" | "blue" | "amber" }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-900",
    blue: "bg-blue-50 text-blue-900",
    amber: "bg-amber-50 text-amber-950",
  };
  return (
    <div className={`rounded-2xl p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">{title}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function MiniKpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <p className="text-xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
