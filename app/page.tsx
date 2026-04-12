import Image from "next/image";
import Link from "next/link";

const links = {
  portal: "/inmuebles",
  owners: "/propietarios",
  pros: "/profesionales",
  app: "https://app.verifika2.com",
  appInmo: "https://app.verifika2.com/?crm=inmo",
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
                Portal inmobiliario verificado
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
            <Link className="hover:text-zinc-950" href={links.portal}>
              Inmuebles
            </Link>
            <a className="hover:text-zinc-950" href="#verificacion">
              Verificación
            </a>
            <Link className="hover:text-zinc-950" href={links.owners}>
              Propietarios
            </Link>
            <Link className="hover:text-zinc-950" href={links.pros}>
              Profesionales
            </Link>
            <a className="hover:text-zinc-950" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={links.appInmo}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--surface-2)]"
            >
              Publicar
            </a>
            <Link
              href={links.portal}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#0F2742]"
            >
              Abrir portal
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-14 md:pb-20 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-zinc-700">
                  Anuncios reales · Evidencias · Trazabilidad
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  Verificación documental
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Un portal inmobiliario donde{" "}
                <span className="text-zinc-600">la seguridad jurídica se ve.</span>
              </h1>

              <p className="max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
                Cuando alguien ve un anuncio, quiere una respuesta simple:{" "}
                <span className="font-medium text-[color:var(--foreground)]">
                  ¿es real?
                </span>{" "}
                Verifika2 muestra evidencias y estado documental para reducir
                fraude, dudas y visitas inútiles.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={links.portal}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#0F2742]"
                >
                  Buscar inmuebles
                </Link>
                <Link
                  href={links.pros}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                >
                  Acceso profesionales
                </Link>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <Kpi
                  title="Evidencias visibles"
                  value="Verificable"
                  hint="Qué se revisó y cuándo. Sin promesas vacías."
                />
                <Kpi
                  title="Menos riesgo de fraude"
                  value="Claridad"
                  hint="El usuario entiende el estado del anuncio."
                />
                <Kpi
                  title="Publicación controlada"
                  value="CRM → Portal"
                  hint="Lo interno se gestiona; lo público se publica."
                />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold tracking-tight">
                    Búsqueda (demo)
                  </p>
                  <span className="rounded-full bg-[color:var(--brand)] px-2 py-1 text-xs font-medium text-[color:var(--brand-foreground)]">
                    Portal
                  </span>
                </div>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <div className="grid gap-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                          <p className="text-xs font-medium text-slate-600">
                            Ciudad
                          </p>
                          <p className="pt-1 text-sm font-semibold">Madrid</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                          <p className="text-xs font-medium text-slate-600">
                            Operación
                          </p>
                          <p className="pt-1 text-sm font-semibold">Venta</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                          <p className="text-xs font-medium text-slate-600">
                            Precio máx.
                          </p>
                          <p className="pt-1 text-sm font-semibold">300.000 €</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--surface-2)] px-4 py-3">
                          <p className="text-xs font-medium text-slate-600">
                            Verificación
                          </p>
                          <p className="pt-1 text-sm font-semibold">
                            Solo verificados
                          </p>
                        </div>
                      </div>
                      <Link
                        href={links.portal}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                      >
                        Ver resultados
                      </Link>
                    </div>
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

        <section
          id="verificacion"
          className="scroll-mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Verificación
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Seguridad jurídica, explicada en la ficha del inmueble.
                </h2>
                <p className="text-sm leading-6 text-zinc-600 md:text-base">
                  Verifika2 reduce la incertidumbre del consumidor final: el
                  anuncio puede mostrar evidencias y estado documental, con
                  trazabilidad. Es un sello que se entiende.
                </p>
                <div className="mt-2 grid gap-3">
                  <Bullet
                    title="Evidencia"
                    desc="Qué documentos respaldan el anuncio (según el caso)."
                  />
                  <Bullet
                    title="Estado"
                    desc="Verificado, en revisión o pendiente, con explicación clara."
                  />
                  <Bullet
                    title="Trazabilidad"
                    desc="Fecha de revisión y control de cambios en la publicación."
                  />
                </div>
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

        <section className="border-t border-[color:var(--border)] bg-[color:var(--surface-2)]">
          <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <p className="text-sm font-semibold tracking-tight">
                  Portal del propietario (área privada)
                </p>
                <p className="pt-2 text-sm leading-6 text-zinc-600">
                  Seguimiento “al minuto” del estado de la operación: hitos,
                  documentación, mensajes y próximos pasos.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniCard title="Hitos" desc="Reserva, arras, notaría, entrega" />
                  <MiniCard title="Documentos" desc="Subidos, validados, pendientes" />
                  <MiniCard title="Comunicación" desc="Mensajes con trazabilidad" />
                  <MiniCard title="Estado" desc="Siempre visible, sin llamadas" />
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={links.owners}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-medium text-white hover:bg-[#0F2742]"
                  >
                    Ver cómo funciona
                  </Link>
                  <a
                    href={links.app}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Acceso
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Propietarios
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Transparencia durante toda la operación.
                </h2>
                <p className="text-sm leading-6 text-zinc-600 md:text-base">
                  El portal del propietario es el puente entre lo interno y lo
                  privado: el estado siempre actualizado, documentación en orden
                  y menos fricción.
                </p>
                <div className="mt-2 grid gap-3">
                  <Bullet
                    title="Estado visible"
                    desc="Qué está hecho, qué falta y quién está asignado."
                  />
                  <Bullet
                    title="Documentación centralizada"
                    desc="Sin WhatsApps con PDFs sueltos."
                  />
                  <Bullet
                    title="Registro"
                    desc="Trazabilidad para reducir conflictos y dudas."
                  />
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
                  La parte interna que hace posible el portal: operativa,
                  documentación, equipo, permisos y automatizaciones.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniCard title="Clientes" desc="Relación y operaciones" />
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
                  El portal es la cara pública. El control vive aquí.
                </h2>
                <p className="text-sm leading-6 text-zinc-600 md:text-base">
                  Verifika2 es más que un CRM inmobiliario: es un sistema modular.
                  Para inmobiliarias habilita publicación y verificación; para
                  otros sectores, activa solo lo que necesiten. La entrada es la
                  misma: acceso profesional y módulos por cliente.
                </p>
                <div className="mt-2 grid gap-3">
                  <Bullet title="Permisos por workspace" desc="Admins locales sin visibilidad global." />
                  <Bullet title="Publicación controlada" desc="Borrador, revisión, publicado, archivado." />
                  <Bullet title="Evidencias vinculadas" desc="Documentación del anuncio en un solo sitio." />
                </div>
                <div className="pt-4">
                  <Link
                    href={links.pros}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Cómo funciona el acceso profesional
                  </Link>
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
                a="Sí. La entrada es “Acceso profesionales” y desde ahí eliges tu workspace y los módulos activos."
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
                  <Link
                    href={links.pros}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm font-medium hover:bg-[color:var(--surface-2)]"
                  >
                    Acceso profesionales
                  </Link>
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
              Inmuebles
            </Link>
            <a className="hover:text-zinc-950" href={links.crm}>
              CRM
            </a>
            <a className="hover:text-zinc-950" href={links.app}>
              Acceso
            </a>
            <Link className="hover:text-zinc-950" href={links.owners}>
              Propietarios
            </Link>
            <Link className="hover:text-zinc-950" href={links.pros}>
              Profesionales
            </Link>
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
