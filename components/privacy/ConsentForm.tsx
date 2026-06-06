import Link from "next/link";
import { PRIVACY_CONSENT_VERSION } from "@/lib/privacyConsent";

type ConsentFormProps = {
  area: "comprador" | "propietario";
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  action: string;
  next: string;
  error?: string;
  contact?: string;
  listingCount?: number;
};

const areaLabel = {
  comprador: "Área comprador",
  propietario: "Portal del propietario",
};

export default function ConsentForm({
  area,
  title,
  subtitle,
  backHref,
  backLabel,
  action,
  next,
  error,
  contact,
  listingCount,
}: ConsentFormProps) {
  return (
    <div className="flex flex-1 flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[#d8e0ea] bg-[#0B1D33] text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link href={backHref} className="text-sm font-medium text-white/64 hover:text-white">
            {backLabel}
          </Link>
          <p className="pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            {areaLabel[area]}
          </p>
          <h1 className="pt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="pt-3 max-w-2xl text-sm leading-6 text-white/72">
            {subtitle}
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-12 lg:grid-cols-12">
        <section className="lg:col-span-6">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-tight">Tratamiento de datos personales</p>
                <p className="pt-2 text-sm leading-6 text-slate-600">
                  Para activar el acceso privado necesitamos dejar constancia de la información recibida y de tu firma electrónica.
                </p>
              </div>
              <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-medium text-slate-700">
                {PRIVACY_CONSENT_VERSION}
              </span>
            </div>

            {error === "missing" ? (
              <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Completa la firma y acepta las casillas obligatorias para continuar.
              </p>
            ) : null}
            {error === "hub" ? (
              <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                No se ha podido registrar el consentimiento. Inténtalo de nuevo.
              </p>
            ) : null}

            <form method="post" action={action} className="pt-6 grid gap-4">
              <input type="hidden" name="next" value={next} />
              <label className="grid gap-2 text-sm font-medium">
                Nombre y apellidos
                <input
                  name="signer_name"
                  placeholder="Nombre completo"
                  className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-normal outline-none focus:border-slate-400"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                DNI/NIE/CIF
                <input
                  name="signer_id_doc"
                  placeholder="Documento identificativo"
                  className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-normal outline-none focus:border-slate-400"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Firma electrónica
                <input
                  name="signature_text"
                  placeholder="Escribe tu nombre completo para firmar"
                  className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-normal outline-none focus:border-slate-400"
                  required
                />
              </label>

              <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <ConsentCheck
                  name="accepted_privacy"
                  text="He leído la información básica sobre protección de datos y entiendo quién trata mis datos y para qué finalidad."
                />
                <ConsentCheck
                  name="accepted_operations"
                  text={area === "propietario"
                    ? "Autorizo el tratamiento necesario para gestionar mi portal de propietario, seguimiento del inmueble, citas, leads, documentación y comunicaciones operativas."
                    : "Autorizo el tratamiento necesario para gestionar mi área de comprador, solicitudes, visitas, documentación, ofertas y comunicaciones operativas."}
                />
                <ConsentCheck
                  name="accepted_rights"
                  text="Entiendo que puedo ejercer mis derechos de acceso, rectificación, supresión, oposición, limitación, portabilidad y retirada del consentimiento cuando proceda."
                />
                <ConsentCheck
                  name="accepted_marketing"
                  optional
                  text="Acepto recibir comunicaciones comerciales o informativas no imprescindibles sobre servicios inmobiliarios y de verificación."
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1D33] px-5 text-sm font-semibold text-white hover:bg-[#0F2742]"
              >
                Firmar y acceder
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-6">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-tight">Información básica</p>
            <div className="pt-5 grid gap-3">
              <InfoRow label="Responsable" value="Grupo Modernia / Verifika2, según la entidad responsable indicada en la documentación contractual o informativa aplicable." />
              <InfoRow label="Finalidad" value={area === "propietario"
                ? "Gestionar el acceso privado, identificación, seguimiento comercial del inmueble, leads, citas, documentación, comunicaciones operativas y trazabilidad de la gestión."
                : "Gestionar el acceso privado, identificación, solicitudes sobre inmuebles, visitas, documentación, ofertas, comunicaciones operativas y trazabilidad de la búsqueda."}
              />
              <InfoRow label="Legitimación" value="Ejecución de la relación solicitada, interés legítimo en la trazabilidad operativa y consentimiento para tratamientos que lo requieran." />
              <InfoRow label="Destinatarios" value="Equipo operativo de Verifika2, intermediarios o colaboradores necesarios para gestionar la operación, proveedores tecnológicos y administraciones cuando exista obligación legal." />
              <InfoRow label="Conservación" value="Durante la relación y los plazos necesarios para atender responsabilidades legales, contractuales y de trazabilidad." />
              <InfoRow label="Derechos" value="Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad mediante el canal de contacto habilitado por Verifika2." />
            </div>
            <div className="mt-5 rounded-2xl bg-[color:var(--surface-2)] px-4 py-3 text-xs leading-5 text-slate-600">
              {contact ? <p>Contacto vinculado: {contact}</p> : null}
              {typeof listingCount === "number" ? <p>Inmuebles vinculados: {listingCount}</p> : null}
              <p className="pt-2">
                Este recibo se guarda con versión, fecha, sujeto, firma escrita y datos técnicos de auditoría.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function ConsentCheck({ name, text, optional = false }: { name: string; text: string; optional?: boolean }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
      <input
        type="checkbox"
        name={name}
        value="1"
        className="mt-1 h-4 w-4 rounded border-[color:var(--border)]"
        required={!optional}
      />
      <span>
        {text}
        {optional ? <span className="text-slate-500"> Opcional.</span> : null}
      </span>
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="pt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
