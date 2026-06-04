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

const audiences = [
  {
    title: "Inmobiliarias",
    desc: "Publica desde el CRM, exige verificación documental y convierte leads en compradores con seguimiento real.",
    href: links.pros,
    cta: "Ver solución profesional",
    stats: ["CRM inmobiliario", "Leads trazados", "Publicación controlada"],
  },
  {
    title: "Propietarios",
    desc: "Accede a un dashboard privado con reportes, clientes interesados, visitas, documentos e hitos de venta.",
    href: links.owners,
    cta: "Ver portal propietario",
    stats: ["Reportes", "Documentos", "Estado comercial"],
  },
  {
    title: "Compradores",
    desc: "Consulta inmuebles con más contexto, solicita visitas y conserva tu área privada con códigos de acceso.",
    href: links.portal,
    cta: "Buscar inmuebles",
    stats: ["Anuncios verificados", "Visitas", "Área comprador"],
  },
];

const features = [
  {
    title: "Anuncios verificados",
    desc: "Cada inmueble puede mostrar evidencias, estado documental, sello premium y datos comerciales ordenados.",
  },
  {
    title: "Lead Hub conectado al CRM",
    desc: "Los interesados entran como compradores, se vinculan al inmueble y aparecen en la ficha comercial.",
  },
  {
    title: "Área propietario",
    desc: "Dashboard privado con leads, citas, estado de clientes, documentos, hitos, firma y vista del anuncio.",
  },
  {
    title: "Área comprador",
    desc: "Código privado para revisar inmuebles consultados, visitas solicitadas, ofertas y próximos pasos.",
  },
  {
    title: "Chat comercial",
    desc: "Capta intención, diferencia comprador y propietario, registra contacto y deriva a la acción correcta.",
  },
  {
    title: "Publicación desde CRM",
    desc: "El equipo decide qué sale al portal, qué queda pendiente y qué evidencias acompañan al anuncio.",
  },
];

const workflow = [
  "El CRM prepara el inmueble, propietarios, evidencias y anuncio.",
  "El portal publica solo lo que está listo para mostrarse.",
  "El comprador deja interés, pide visita u oferta desde web o chat.",
  "El propietario ve reportes y estado comercial en su dashboard.",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <PublicHeader />

      <main className="flex-1">
        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-6xl gap-10 px-6 py-10 md:min-h-[720px] md:py-14 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-xs font-semibold text-slate-700">
                  Portal inmobiliario + CRM + áreas privadas
                </span>
                <span className="inline-flex rounded-full bg-[#F2C14E] px-3 py-1 text-xs font-semibold text-[#1A1A1A]">
                  Grupo Modernia
                </span>
              </div>

              <div className="grid gap-5">
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight md:text-6xl">
                  La plataforma inmobiliaria donde el anuncio, el lead y la operación están conectados.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  Verifika2 presenta inmuebles verificados, capta compradores,
                  crea perfiles comerciales y da a propietarios e inmobiliarias
                  una visión clara de cada venta.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#0F2742]" href={links.portal}>
                  Ver inmuebles
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 text-sm font-semibold hover:bg-[color:var(--surface-2)]" href={links.pros}>
                  Quiero probarlo
                </Link>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold text-slate-600 hover:text-[color:var(--foreground)]" href={links.publish}>
                  Publicar inmueble
                </Link>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <Metric value="CRM" label="gestiona la operación" />
                <Metric value="Portal" label="convierte interés real" />
                <Metric value="Dashboards" label="propietario y comprador" />
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-12">
            <div className="grid gap-4 md:grid-cols-3">
              {audiences.map((item) => (
                <AudienceCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Producto comercial
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Todo lo que necesita una inmobiliaria moderna en la parte pública.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                La home debe vender una idea simple: Verifika2 no es solo una
                web de inmuebles. Es una experiencia comercial completa desde la
                publicación hasta el seguimiento del comprador y el reporte al propietario.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]" href={links.pros}>
                  Alta profesional
                </Link>
                <a className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-semibold hover:bg-[color:var(--surface-2)]" href={links.crm}>
                  Acceso CRM
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[#0B1D33] text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Flujo conectado
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Del CRM al portal, y del portal de vuelta al CRM.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                El valor está en cerrar el circuito: lo que publica la
                inmobiliaria genera leads; esos leads se convierten en
                compradores; el propietario ve actividad real.
              </p>
            </div>

            <div className="grid gap-3">
              {workflow.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-white/12 bg-white/7 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2C14E] text-sm font-bold text-[#1A1A1A]">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-white/82">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Experiencia privada
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  El propietario y el comprador no se quedan fuera de la operación.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Cada parte tiene su espacio: el propietario ve reportes,
                  visitas, clientes y anuncio; el comprador ve sus solicitudes,
                  citas, ofertas y evolución del contacto.
                </p>
              </div>
              <div className="grid gap-3">
                <PrivateArea title="Dashboard propietario" href={links.ownerAccess} items={["Leads y clientes", "Citas y estado", "Documentos e hitos", "Vista del anuncio"]} />
                <PrivateArea title="Área comprador" href={links.buyer} items={["Inmuebles consultados", "Visitas solicitadas", "Ofertas", "Código privado"]} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    Empieza por donde eres hoy: inmobiliaria, propietario o comprador.
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    La web ya tiene las tres entradas comerciales. La diferencia
                    es que todas terminan en datos útiles para operar mejor.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]" href={links.pros}>
                    Solicitar alta
                  </Link>
                  <Link className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-semibold hover:bg-[color:var(--surface-2)]" href={links.portal}>
                    Explorar portal
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

function ProductPreview() {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3 shadow-[var(--shadow-soft)]">
      <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/grupo_modernia_logo.png" alt="Grupo Modernia" width={42} height={42} className="h-10 w-10 object-contain" />
            <div>
              <p className="text-sm font-semibold">Grupo Modernia</p>
              <p className="text-xs text-slate-500">Inmueble verificado</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Publicado
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[#D9DEE6]">
            <div className="grid min-h-[180px] grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#C8D1DA] p-5">
                <div className="h-full rounded-xl border border-white/70 bg-white/35" />
              </div>
              <div className="grid grid-rows-2 gap-2 p-3">
                <div className="rounded-xl bg-white/55" />
                <div className="rounded-xl bg-white/35" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight">Piso familiar verificado</p>
                <p className="pt-1 text-sm text-slate-600">Madrid · Venta · 3 habitaciones</p>
              </div>
              <p className="text-lg font-semibold">289.000 €</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <PreviewPill label="Nota simple" status="OK" />
              <PreviewPill label="Energético" status="OK" />
              <PreviewPill label="Anuncio" status="OK" />
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
            <p className="text-sm font-semibold">Lead convertido en comprador</p>
            <div className="grid gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>Cliente interesado</span>
                <span className="font-semibold">Perfil creado</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Ficha del inmueble</span>
                <span className="font-semibold">Comprador vinculado</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Propietario</span>
                <span className="font-semibold">Reporte visible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{label}</p>
    </div>
  );
}

function AudienceCard({
  title,
  desc,
  href,
  cta,
  stats,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  stats: string[];
}) {
  return (
    <Link className="group rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]" href={href}>
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {stats.map((stat) => (
          <span key={stat} className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
            {stat}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-[#0B1D33] group-hover:underline">{cta}</p>
    </Link>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="mb-4 h-1.5 w-10 rounded-full bg-[#F2C14E]" />
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

function PrivateArea({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: string[];
}) {
  return (
    <Link className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm hover:bg-[color:var(--surface-2)]" href={href}>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </Link>
  );
}

function PreviewPill({ label, status }: { label: string; status: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-800">{status}</p>
    </div>
  );
}
