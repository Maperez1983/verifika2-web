import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ConsentForm from "@/components/privacy/ConsentForm";
import { getBuyerSession } from "@/lib/buyerSessionServer";
import { sanitizeRelativePath } from "@/lib/http";
import {
  consentSubjectForBuyer,
  hasPrivacyConsent,
} from "@/lib/privacyConsent";

export const metadata: Metadata = {
  title: "Tratamiento de datos comprador",
  description: "Firma de tratamiento de datos para acceder al área privada del comprador.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function BuyerConsentPage({ searchParams }: PageProps) {
  const session = await getBuyerSession();
  if (!session) redirect("/comprador/acceso?next=/comprador/tratamiento-datos");

  const params = (await searchParams) || {};
  const next = sanitizeRelativePath(params.next, "/comprador");
  const error = normalize(params.error);
  const accepted = await hasPrivacyConsent("comprador", consentSubjectForBuyer(session));
  if (accepted) redirect(next);

  return (
    <ConsentForm
      area="comprador"
      title="Firma el tratamiento de datos para activar tu área privada"
      subtitle="Tu panel de comprador contiene solicitudes, visitas, documentación y seguimiento de operaciones. Antes de entrar, necesitamos registrar tu aceptación informada."
      backHref="/comprador/acceso"
      backLabel="← Volver al acceso comprador"
      action="/api/buyer-consent"
      next={next}
      error={error}
      contact={session.contact}
    />
  );
}
