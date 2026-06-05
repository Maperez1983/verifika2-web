import Image from "next/image";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";
import PublicFooter from "@/components/site/PublicFooter";
import PublicHeader from "@/components/site/PublicHeader";

const links = {
  portal: "/inmuebles",
  owners: "/propietarios",
  ownerAccess: "/owner",
  buyer: "/compradores",
  buyerAccess: "/comprador",
  pros: "/profesionales",
  publish: "/publicar",
  how: "/como-funciona",
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
    desc: "Vendedores particulares o con inmobiliaria con seguimiento 360 en tiempo real de la gestión de su inmueble.",
    proof: "Citas, agenda, clientes interesados, gestión del intermediario, hitos, documentos y anuncio publicado.",
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
    title: "Vendedores particulares",
    badge: "Confianza",
    desc: "Tienen un portal propio para saber en todo momento qué ocurre con la venta de su inmueble, incluso si gestiona una inmobiliaria.",
    href: links.owners,
    cta: "Ver portal vendedor",
    bullets: ["Seguimiento 360", "Citas y agenda", "Gestión intermediario", "Estado del anuncio"],
  },
  {
    title: "Compradores",
    badge: "Seguridad",
    desc: "Disponen de un portal virtual para gestionar los inmuebles que han consultado o visitado y solicitar información documental.",
    href: links.buyer,
    cta: "Ver portal comprador",
    bullets: ["Inmuebles visitados", "Seguimiento", "Solicitar documentación", "Verificación documental"],
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

const productStories = [
  {
    title: "Comprador que pide documentación",
    desc: "Antes de visitar, solicita información documental. El interés queda vinculado al inmueble y se crea seguimiento privado.",
    result: "Menos dudas antes de reservar",
  },
  {
    title: "Propietario que revisa la gestión",
    desc: "Consulta clientes interesados, citas, agenda, estado del anuncio y próximos pasos desde su dashboard.",
    result: "Control 360 de la venta",
  },
  {
    title: "Inmobiliaria que no pierde leads",
    desc: "Publica desde CRM, recibe solicitudes con contexto y convierte el interés en comprador gestionable.",
    result: "Operativa trazable",
  },
];

const commercialPlans = [
  {
    name: "Portal verificado",
    audience: "Propietarios particulares",
    price: "Desde verificación",
    desc: "Publicación controlada del inmueble, revisión documental inicial y entrada al circuito comercial.",
    features: ["Anuncio verificado", "Solicitud de documentación", "Leads trazables", "Portal propietario"],
    href: links.publish,
    cta: "Solicitar publicación",
  },
  {
    name: "Inmobiliaria CRM",
    audience: "Agencias e inmobiliarias",
    price: "Plan profesional",
    desc: "Workspace inmobiliario con cartera, leads, agenda, compradores, propietarios y publicación conectada.",
    features: ["CRM inmobiliario", "Portal público", "Dashboard propietario", "Chat y leads"],
    href: links.pros,
    cta: "Alta profesional",
  },
  {
    name: "Certificación premium",
    audience: "Operaciones con más exigencia",
    price: "Por inmueble",
    desc: "Dossier reforzado para operaciones donde la confianza documental es parte central de la decisión.",
    features: ["Titularidad", "Registro y cargas", "Evidencias", "Sello premium"],
    href: "/certificacion",
    cta: "Ver certificación",
  },
];

const launchChecklist = [
  "Demo comercial con inmuebles reales y fotos cuidadas",
  "Recorrido completo comprador, propietario e inmobiliaria",
  "CRM conectado a publicación, leads, citas y ofertas",
  "Mensajes claros de verificación, límites y próximos pasos",
  "Datos de contacto y alta profesional visibles en cada recorrido",
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
                  Soy inmobiliaria
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20" href={links.portal}>
                  Busco inmueble
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white px-5 text-sm font-semibold text-[#0B1D33] hover:bg-slate-100" href={links.owners}>
                  Soy propietario
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/20" href={links.how}>
                  Cómo funciona
                </Link>
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

        <JourneySelector />

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Casos de uso
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Ejemplos reales de cómo la web genera confianza.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                La experiencia no se queda en ver anuncios: ordena información, crea perfiles, registra actividad y muestra el avance a quien corresponde.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {productStories.map((story) => (
                <StoryCard key={story.title} {...story} />
              ))}
            </div>
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
                  que necesita. La inmobiliaria opera, el vendedor controla el
                  avance de su propiedad y el comprador decide con más seguridad.
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
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Demo guiada
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Mira cómo funciona Verifika2 por dentro.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                Recorre el producto como lo viviría cada perfil: publicación profesional, seguimiento del propietario y decisión del comprador.
              </p>
            </div>
            <div className="grid gap-3">
              <DemoStep index="01" title="Publicar con CRM" desc="La inmobiliaria crea el inmueble, vincula documentación y decide cuándo se publica." href={links.pros} />
              <DemoStep index="02" title="Seguimiento propietario" desc="El vendedor consulta actividad, citas, clientes y estado de gestión en su dashboard." href={links.owners} />
              <DemoStep index="03" title="Decisión comprador" desc="El comprador solicita documentación, visita u oferta y sigue el proceso en su área privada." href={links.buyer} />
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
                <Link className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/20" href={links.pros}>
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
                  Seguimiento 360 a tiempo real de la venta de tu inmueble.
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                  Si vendes, tienes información de la gestión de tu propiedad:
                  citas, agenda, clientes interesados y tareas del intermediario.
                  Si compras, tienes un portal virtual para gestionar los
                  inmuebles que has consultado o visitado, hacer seguimiento y
                  solicitar documentación o verificación de su situación documental.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PrivateDashboard title="Portal vendedor" href={links.ownerAccess} metrics={["Citas", "Agenda", "Intermediario", "Clientes"]} />
                <PrivateDashboard title="Portal comprador" href={links.buyerAccess} metrics={["Visitados", "Seguimiento", "Documentación", "Verificación"]} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Producto comercializable
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Preparado para demos, pilotos y primeras altas comerciales.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                Verifika2 se presenta como beta comercial avanzada: suficiente para enseñar valor, captar clientes y validar operaciones reales con control.
              </p>
              <div className="mt-6 rounded-[24px] border border-[#ead7a4] bg-[#fff8e5] p-5">
                <p className="text-sm font-semibold text-[#5a4300]">Mensaje comercial recomendado</p>
                <p className="mt-2 text-sm leading-6 text-[#5a4300]">
                  Portal inmobiliario verificado con CRM, IA, trazabilidad de leads y áreas privadas para comprador y propietario.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              {launchChecklist.map((item, index) => (
                <LaunchItem key={item} index={index + 1} text={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Monetización
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Tres líneas comerciales claras desde el primer día.
                </h2>
              </div>
              <Link href={links.publish} className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]">
                Empezar publicación
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {commercialPlans.map((plan) => (
                <CommercialPlanCard key={plan.name} {...plan} />
              ))}
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
                    Para una inmobiliaria es captación y CRM. Para un vendedor,
                    seguimiento total de su propiedad. Para un comprador,
                    seguridad. Para todos, menos incertidumbre y una experiencia
                    más profesional.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2C14E] px-5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F6CD68]" href={links.pros}>
                    Quiero darme de alta
                  </Link>
                  <Link className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/20" href={links.portal}>
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

function StoryCard({ title, desc, result }: { title: string; desc: string; result: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-base font-semibold tracking-tight">{title}</p>
      <p className="mt-3 min-h-[120px] text-sm leading-6 text-slate-600">{desc}</p>
      <p className="mt-4 rounded-2xl bg-[color:var(--surface-2)] px-3 py-2 text-xs font-semibold text-slate-700">
        {result}
      </p>
    </div>
  );
}

function DemoStep({ index, title, desc, href }: { index: string; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold text-[#9a6b00]">{index}</p>
      <p className="pt-2 text-base font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-slate-600">{desc}</p>
      <p className="pt-4 text-sm font-semibold group-hover:underline">Ver recorrido</p>
    </Link>
  );
}

function LaunchItem({ index, text }: { index: number; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B1D33] text-sm font-semibold text-white">
        {index}
      </span>
      <p className="text-sm font-semibold leading-6 text-slate-800">{text}</p>
    </div>
  );
}

function CommercialPlanCard({
  name,
  audience,
  price,
  desc,
  features,
  href,
  cta,
}: {
  name: string;
  audience: string;
  price: string;
  desc: string;
  features: string[];
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="group flex min-h-[360px] flex-col justify-between rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{audience}</p>
        <p className="mt-3 text-xl font-semibold tracking-tight">{name}</p>
        <p className="mt-2 text-sm font-semibold text-[#9a6b00]">{price}</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">{desc}</p>
        <div className="mt-5 grid gap-2">
          {features.map((feature) => (
            <span key={feature} className="rounded-2xl border border-[#ead7a4] bg-[#fff8e5] px-3 py-2 text-xs font-semibold text-[#5a4300]">
              {feature}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm font-semibold text-[#0B1D33] group-hover:underline">{cta}</p>
    </Link>
  );
}

function HeroShowcase() {
  return (
    <div className="rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
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
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/62">{label}</p>
    </div>
  );
}

function JourneySelector() {
  const paths = [
    {
      role: "Comprador",
      title: "Quiero comprar o alquilar con seguridad",
      desc: "Explora inmuebles verificados, solicita visita y pide documentación desde tu espacio privado.",
      href: links.buyer,
      action: "Ver experiencia comprador",
    },
    {
      role: "Propietario",
      title: "Quiero vender con seguimiento total",
      desc: "Accede a reportes de citas, interesados, agenda, estado del anuncio y gestión del intermediario.",
      href: links.owners,
      action: "Ver portal propietario",
    },
    {
      role: "Inmobiliaria",
      title: "Quiero publicar y operar con CRM",
      desc: "Convierte leads en compradores, coordina visitas, controla documentación y muestra un producto premium.",
      href: links.pros,
      action: "Alta profesional",
    },
  ];

  return (
    <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Empieza por tu perfil
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Una entrada clara para cada cliente.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              La experiencia evita que el usuario tenga que interpretar la plataforma: cada perfil tiene su recorrido, datos y siguiente acción.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {paths.map((item) => (
              <Link
                key={item.role}
                href={item.href}
                className="group flex min-h-[220px] flex-col justify-between rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <div>
                  <span className="rounded-full bg-[#F2C14E] px-3 py-1 text-xs font-semibold text-[#1A1A1A]">
                    {item.role}
                  </span>
                  <p className="mt-4 text-base font-semibold tracking-tight">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.desc}</p>
                </div>
                <span className="mt-5 text-sm font-semibold text-[#0B1D33] group-hover:underline">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
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
    <div className="rounded-[28px] border border-white/15 bg-white/10 p-4">
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
