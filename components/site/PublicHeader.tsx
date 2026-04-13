import Link from "next/link";
import BrandMark from "@/components/site/BrandMark";

const links = {
  portal: "/inmuebles",
  verification: "/verificacion",
  certification: "/certificacion",
  owners: "/propietarios",
  pros: "/profesionales",
  publish: "/publicar",
  app: "https://app.verifika2.com",
};

export default function PublicHeader({
  current,
  showBack,
  backHref = "/",
  backLabel = "Volver",
}: {
  current?: keyof typeof links;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]/85 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        {showBack ? (
          <div className="pb-4">
            <Link href={backHref} className="text-sm font-medium text-slate-600 hover:text-[color:var(--foreground)]">
              ← {backLabel}
            </Link>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <BrandMark />

          <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
            <Link className={navCls(current === "portal")} href={links.portal}>
              Inmuebles
            </Link>
            <Link className={navCls(current === "verification")} href={links.verification}>
              Verificación
            </Link>
            <Link className={navCls(current === "certification")} href={links.certification}>
              Premium
            </Link>
            <Link className={navCls(current === "owners")} href={links.owners}>
              Propietarios
            </Link>
            <Link className={navCls(current === "pros")} href={links.pros}>
              Profesionales
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={links.publish}
              className="hidden h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--surface-2)] md:inline-flex"
            >
              Publicar
            </Link>
            <a
              href={links.app}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1D33] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#0F2742]"
            >
              Acceso
            </a>
          </div>
        </div>

        <details className="mt-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 md:hidden">
          <summary className="cursor-pointer text-sm font-semibold">Menú</summary>
          <div className="pt-4 grid gap-3 text-sm text-slate-700">
            <Link className="hover:underline" href={links.portal}>
              Inmuebles
            </Link>
            <Link className="hover:underline" href={links.verification}>
              Verificación
            </Link>
            <Link className="hover:underline" href={links.certification}>
              Premium
            </Link>
            <Link className="hover:underline" href={links.owners}>
              Propietarios
            </Link>
            <Link className="hover:underline" href={links.pros}>
              Profesionales
            </Link>
            <Link className="hover:underline" href={links.publish}>
              Publicar
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

function navCls(active: boolean) {
  return active ? "text-zinc-950 font-semibold" : "hover:text-zinc-950";
}

