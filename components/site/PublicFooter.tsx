import Link from "next/link";

const year = new Date().getFullYear();

export default function PublicFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold tracking-tight">Verifika2</p>
            <p className="pt-3 max-w-md text-sm leading-6 text-slate-600">
              Portal inmobiliario con anuncios verificados documentalmente. Menos incertidumbre, más trazabilidad y
              confianza para comprador, inquilino y propietario.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Producto
            </p>
            <div className="pt-3 grid gap-2 text-sm text-slate-700">
              <Link className="hover:underline" href="/inmuebles">
                Inmuebles
              </Link>
              <Link className="hover:underline" href="/verificacion">
                Verificación
              </Link>
              <Link className="hover:underline" href="/certificacion">
                Certificación
              </Link>
              <Link className="hover:underline" href="/publicar">
                Publicar
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Accesos
            </p>
            <div className="pt-3 grid gap-2 text-sm text-slate-700">
              <a className="hover:underline" href="https://app.verifika2.com">
                Acceso
              </a>
              <a className="hover:underline" href="https://crm.verifika2.com">
                CRM
              </a>
              <Link className="hover:underline" href="/owner">
                Owner Portal
              </Link>
              <Link className="hover:underline" href="/admin">
                Admin
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col gap-2 border-t border-[color:var(--border)] text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {year} Verifika2</p>
          <p>Beta: el contenido del certificado y los disclaimers se definirán en la fase de producto.</p>
        </div>
      </div>
    </footer>
  );
}

