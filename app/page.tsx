import Image from "next/image";
import Link from "next/link";

const links = {
  portal: "/inmuebles",
  app: "https://app.verifika2.com",
  crm: "https://crm.verifika2.com",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,193,78,0.38),rgba(242,193,78,0)_60%)] blur-2xl" />
        <div className="absolute right-[-220px] top-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.14),rgba(24,24,27,0)_60%)] blur-2xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="leading-tight">
              <span className="block">
                <Image
                  src="/brand/verifika2_wordmark_traced.svg"
                  alt="Verifika2"
                  width={180}
                  height={38}
                  priority
                  className="h-7 w-auto"
                />
              </span>
              <p className="pt-1 text-xs text-slate-600">
                Plataforma modular · Portal inmobiliario verificado
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
            <a className="hover:text-zinc-950" href="#plataforma">
              Plataforma
            </a>
            <a className="hover:text-zinc-950" href="#portal">
              Portal
            </a>
            <a className="hover:text-zinc-950" href="#verificacion">
              Verificación
            </a>
            <a className="hover:text-zinc-950" href="#crm">
              CRM
            </a>
            <a className="hover:text-zinc-950" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={links.app}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--surface-2)]"
            >
              Entrar
            </a>
            <Link
              href={links.portal}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#0F2742]"
            >
              Ver inmuebles
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-14 md:pb-20 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  Beta privada
                </span>
                <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-zinc-700">
                  Sistema integral · Módulos a medida · Sello verificable
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Controla tu empresa.
                <span className="block pt-2">Publica inmuebles con confianza.</span>
                <span className="block pt-2 text-zinc-600">
                  Plataforma modular + verificación documental en el portal.
                </span>
              </h1>

              <p className="max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
                Verifika2 es un sistema integral para gestionar empresas con
                módulos personalizados. Su vertical inmobiliaria nace para
                reducir la inseguridad jurídica: anuncios verificables, evidencias
                visibles y menos riesgo de fraude.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={links.portal}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#0F2742]"
                >
                  Explorar el portal
                </Link>
                <a
                  href={links.crm}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                >
                  Ver el CRM
                </a>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <Kpi title="Sello por anuncio" value="Verificado" hint="Checklist documental y trazabilidad." />
                <Kpi title="Publicación controlada" value="CRM → Portal" hint="Visible solo cuando tú decidas." />
                <Kpi title="Confianza para el usuario" value="Transparencia" hint="Estado documental claro y auditable." />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold tracking-tight">Portal</p>
                    <span className="rounded-full bg-[color:var(--brand)] px-2 py-1 text-xs font-medium text-[color:var(--brand-foreground)]">
                      Demo
                    </span>
                  </div>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Piso reformado · 112 m²
                        </p>
                        <p className="pt-1 text-sm text-zinc-600">
                          3 hab · 2 baños · Terraza · Garaje
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                        Verificado
                      </span>
                    </div>
                    <p className="pt-3 text-2xl font-semibold tracking-tight">
                      285.000 €
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="text-sm font-semibold">Sello Verifika2</p>
                    <p className="pt-2 text-sm text-zinc-600">
                      Evidencias visibles para reducir dudas, inseguridad
                      jurídica y riesgo de fraude.
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-zinc-700">
                      <Check>Nota simple / titularidad</Check>
                      <Check>Certificado energético</Check>
                      <Check>Documentación del anuncio</Check>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,193,78,0.42),rgba(242,193,78,0)_60%)] blur-2xl" />
            </div>
          </div>
        </section>

        <section id="plataforma" className="scroll-mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Plataforma
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Un sistema integral para controlar tu empresa, con módulos a medida.
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-zinc-600 md:text-base">
                Verifika2 se adapta a cada operativa: módulos, roles, flujos y
                automatizaciones. En inmobiliaria, esto se extiende al portal
                público con verificación documental por anuncio.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Feature
                title="Módulos personalizados"
                desc="Activables por cliente: verticales, transversales y automatizaciones."
              />
              <Feature
                title="Control y trazabilidad"
                desc="Permisos por workspace, auditoría y documentación vinculada a procesos."
              />
              <Feature
                title="Operativa unificada"
                desc="Desde el CRM salen clientes, inmuebles y publicación, sin duplicidades."
              />
            </div>

            <div id="portal" className="mt-10 scroll-mt-24 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Portal inmobiliario
                  </p>
                  <p className="pt-2 text-xl font-semibold tracking-tight md:text-2xl">
                    Un portal como los de siempre, pero con anuncios verificables.
                  </p>
                  <p className="pt-2 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
                    La ficha pública muestra el estado documental del anuncio,
                    evidencias y última revisión. El objetivo: que el consumidor
                    final entienda si el anuncio es real y en qué situación está.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={links.portal}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Abrir portal
                  </Link>
                  <a
                    href={links.crm}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Gestionar en CRM
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Callout
                title="Para el público"
                desc="Un portal que reduce sorpresas: datos verificables y fichas limpias."
                ctaLabel="Ver el portal"
                ctaHref={links.portal}
              />
              <Callout
                title="Para inmobiliarias"
                desc="Desde el CRM, publica y gestiona operaciones, equipo y documentación."
                ctaLabel="Entrar al CRM"
                ctaHref={links.crm}
              />
            </div>
          </div>
        </section>

        <section id="verificacion" className="scroll-mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Verificación
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Un sello que se explica, no que se promete.
                </h2>
                <p className="text-sm leading-6 text-zinc-600 md:text-base">
                  El sello Verifika2 no es un “check” genérico: muestra qué se ha
                  revisado, cuándo y con qué evidencia. Así disminuye la
                  inseguridad jurídica del consumidor final y la incertidumbre de
                  la operación.
                </p>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Sello Verifika2</p>
                      <p className="pt-1 text-sm text-zinc-600">
                        Ejemplo de evidencias públicas.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                      Verificado
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm text-zinc-700">
                    <Evidence label="Titularidad / nota simple" status="ok" />
                    <Evidence label="Certificado energético" status="ok" />
                    <Evidence label="Datos del anuncio" status="ok" />
                    <Evidence label="Urbanismo (si aplica)" status="review" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="crm" className="scroll-mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <p className="text-sm font-semibold tracking-tight">CRM 360</p>
                <p className="pt-2 text-sm leading-6 text-zinc-600">
                  Donde vive la operativa: clientes, oportunidades, inmuebles,
                  documentación, automatizaciones y RRHH.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniCard title="Inmuebles" desc="Pipeline, visitas y publicación" />
                  <MiniCard title="Documentación" desc="Evidencias, plantillas y trazabilidad" />
                  <MiniCard title="Equipo" desc="Usuarios, roles y accesos" />
                  <MiniCard title="Automatizaciones" desc="Flujos para reducir tareas repetitivas" />
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={links.crm}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Abrir CRM
                  </a>
                  <a
                    href={links.app}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Acceso app
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Operativa
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Diseñado para publicar sin perder el control.
                </h2>
                <p className="text-sm leading-6 text-zinc-600 md:text-base">
                  Separación por workspaces, roles por cliente y permisos claros:
                  cada inmobiliaria opera con sus datos, sin herencias
                  indeseadas.
                </p>
                <div className="mt-2 grid gap-3">
                  <Bullet title="Permisos por workspace" desc="Admins locales sin visibilidad global." />
                  <Bullet title="Publicación controlada" desc="Borrador, revisión, publicado, archivado." />
                  <Bullet title="Evidencias vinculadas" desc="Documentación del anuncio en un solo sitio." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                FAQ
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Preguntas rápidas
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Faq
                q="¿Verifika2 es un Idealista?"
                a="Funciona como un portal de anuncios, pero añade una plataforma operativa (CRM) y un sello de verificación con evidencias."
              />
              <Faq
                q="¿Qué significa “verificado”?"
                a="Que el anuncio tiene evidencias asociadas (según el caso) y un estado documental visible. No es un claim: es trazabilidad."
              />
              <Faq
                q="¿Puedo acceder al CRM desde la web?"
                a="Sí: la landing enlaza al acceso. Más adelante podemos integrar un “login” unificado."
              />
              <Faq
                q="¿Cómo empiezo con mi inmobiliaria?"
                a="Ahora estamos en beta. Activamos módulos, roles y el flujo de publicación, y definimos el checklist de verificación."
              />
            </div>

            <div className="mt-10 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6 md:p-8">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold">
                    ¿Quieres que la home sea 100% “portal” o “producto”?
                  </p>
                  <p className="pt-2 text-sm text-zinc-600">
                    Podemos priorizar el buscador de inmuebles o una landing más
                    comercial. Lo ajustamos según estrategia.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={links.portal}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Ver inmuebles
                  </Link>
                  <a
                    href={links.app}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Entrar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <Image
                src="/brand/verifika2_wordmark_traced.svg"
                alt="Verifika2"
                width={160}
                height={34}
                className="h-6 w-auto"
              />
              <p className="pt-1 text-xs text-slate-600">
                Portal inmobiliario verificado
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-zinc-950" href={links.portal}>
              Portal
            </Link>
            <a className="hover:text-zinc-950" href={links.crm}>
              CRM
            </a>
            <a className="hover:text-zinc-950" href={links.app}>
              Acceso
            </a>
          </div>
          <p>© {new Date().getFullYear()} Verifika2</p>
        </div>
      </footer>
    </div>
  );
}

function Kpi({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <p className="text-xs font-medium text-zinc-600">{title}</p>
      <p className="pt-2 text-lg font-semibold tracking-tight">{value}</p>
      <p className="pt-1 text-xs leading-5 text-zinc-600">{hint}</p>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
      </span>
      <span>{children}</span>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

function Callout({
  title,
  desc,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const isInternal = ctaHref.startsWith("/");
  const common =
    "inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white hover:bg-[#0F2742]";

  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-zinc-600">{desc}</p>
      <div className="pt-5">
        {isInternal ? (
          <Link href={ctaHref} className={common}>
            {ctaLabel}
          </Link>
        ) : (
          <a href={ctaHref} className={common}>
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function Evidence({ label, status }: { label: string; status: "ok" | "review" }) {
  const pill =
    status === "ok"
      ? "bg-emerald-50 text-emerald-800"
      : "bg-amber-50 text-amber-800";
  const text = status === "ok" ? "OK" : "Revisión";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
      <span className="text-sm">{label}</span>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${pill}`}>
        {text}
      </span>
    </div>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-1 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

function Bullet({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="pt-2 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
      <p className="text-sm font-semibold tracking-tight">{q}</p>
      <p className="pt-2 text-sm leading-6 text-zinc-600">{a}</p>
    </div>
  );
}
