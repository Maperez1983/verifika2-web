import Link from "next/link";

const links = {
  portal: "/inmuebles",
  app: "https://app.verifika2.com",
  crm: "https://crm.verifika2.com",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white">
              V2
            </span>
            <span className="text-base font-semibold tracking-tight">
              Verifika2
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
            <Link className="hover:text-zinc-950" href={links.portal}>
              Portal
            </Link>
            <a className="hover:text-zinc-950" href={links.app}>
              Acceso
            </a>
            <a className="hover:text-zinc-950" href={links.crm}>
              CRM
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={links.app}
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Entrar
            </a>
            <Link
              href={links.portal}
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Ver inmuebles
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <p className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                Anuncios verificados documentalmente
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                El portal inmobiliario donde la confianza se publica.
              </h1>
              <p className="text-base leading-7 text-zinc-600 md:text-lg">
                Verifika2 combina CRM + portal público para que las inmobiliarias
                publiquen inmuebles con un sello de verificación. Menos dudas,
                más visitas útiles.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={links.portal}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Explorar inmuebles
                </Link>
                <a
                  href={links.crm}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Gestionar en el CRM
                </a>
              </div>
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold">Verificación</p>
                  <p className="pt-1 text-sm text-zinc-600">
                    Documentación y trazabilidad por anuncio.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold">Publicación</p>
                  <p className="pt-1 text-sm text-zinc-600">
                    Publica desde el CRM y controla visibilidad.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold">Experiencia</p>
                  <p className="pt-1 text-sm text-zinc-600">
                    Fichas claras, filtros rápidos y SEO.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold">
                      Piso en el centro · Verificado
                    </p>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                      OK
                    </span>
                  </div>
                  <p className="pt-2 text-sm text-zinc-600">
                    3 hab · 2 baños · 112 m² · Terraza · Garaje
                  </p>
                  <p className="pt-3 text-2xl font-semibold tracking-tight">
                    285.000 €
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-sm font-semibold">
                    Checklist de verificación
                  </p>
                  <ul className="pt-3 space-y-2 text-sm text-zinc-700">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Nota simple / titularidad
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Certificado energético
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Situación urbanística (si aplica)
                    </li>
                  </ul>
                  <p className="pt-3 text-xs text-zinc-500">
                    Ejemplo. El sello se adapta por tipo de inmueble.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold">Para el público</p>
                <p className="pt-2 text-sm leading-6 text-zinc-600">
                  Un portal claro con información verificada y menos sorpresas.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold">Para inmobiliarias</p>
                <p className="pt-2 text-sm leading-6 text-zinc-600">
                  Publica desde el CRM y centraliza operaciones, equipo y
                  documentación.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold">Para propietarios</p>
                <p className="pt-2 text-sm leading-6 text-zinc-600">
                  Acceso privado para seguimiento, documentación y estado del
                  anuncio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Verifika2</p>
          <div className="flex gap-4">
            <Link className="hover:text-zinc-950" href={links.portal}>
              Portal
            </Link>
            <a className="hover:text-zinc-950" href={links.app}>
              Acceso
            </a>
            <a className="hover:text-zinc-950" href={links.crm}>
              CRM
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
