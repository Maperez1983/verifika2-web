import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ConsentForm from "@/components/privacy/ConsentForm";
import { getOwnerSession } from "@/lib/ownerSessionServer";
import { sanitizeRelativePath } from "@/lib/http";
import {
  consentSubjectForOwner,
  hasPrivacyConsent,
} from "@/lib/privacyConsent";

export const metadata: Metadata = {
  title: "Tratamiento de datos propietario",
  description: "Firma de tratamiento de datos para acceder al portal privado del propietario.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const normalize = (value: unknown) => String(value ?? "").trim();

export default async function OwnerConsentPage({ searchParams }: PageProps) {
  const session = await getOwnerSession();
  if (!session) redirect("/owner/acceso?next=/owner/tratamiento-datos");

  const params = (await searchParams) || {};
  const next = sanitizeRelativePath(params.next, "/owner");
  const error = normalize(params.error);
  const accepted = await hasPrivacyConsent("propietario", consentSubjectForOwner(session));
  if (accepted) redirect(next);

  return (
    <ConsentForm
      area="propietario"
      title="Firma el tratamiento de datos para activar tu portal"
      subtitle="Tu portal de propietario muestra actividad comercial, interesados, citas, documentación y seguimiento de la gestión. Antes de entrar, necesitamos registrar tu aceptación informada."
      backHref="/owner/acceso"
      backLabel="← Volver al acceso propietario"
      action="/api/owner-consent"
      next={next}
      error={error}
      listingCount={session.listingIds.length}
    />
  );
}
